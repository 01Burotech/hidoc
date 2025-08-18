import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription } from '../entities/prescription.entity';
import { PrescriptionItem } from '../entities/prescription-item.entity';
import { DoctorSignature } from '../entities/doctor-signature.entity';
import { CreatePrescriptionInput } from './dto/create-prescription.input';
import { ICertificateProvider } from '../signature/interfaces/certificate-provider.interface';
import { hashBuffer } from './utils/hash.util';
import { generatePrescriptionPDF } from './utils/pdf.util';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PrescriptionStatus, SignatureType } from 'src/entities/enums';

@Injectable()
export class PrescriptionsService {
  private s3: S3Client;

  constructor(
    @InjectRepository(Prescription)
    private prescriptionRepo: Repository<Prescription>,
    @InjectRepository(PrescriptionItem)
    private itemRepo: Repository<PrescriptionItem>,
    @InjectRepository(DoctorSignature)
    private signatureRepo: Repository<DoctorSignature>,
    @Inject('ICertificateProvider')
    private certProvider: ICertificateProvider,
  ) {
    this.s3 = new S3Client({
      endpoint: process.env.MINIO_ENDPOINT,
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY!,
        secretAccessKey: process.env.MINIO_SECRET_KEY!,
      },
      forcePathStyle: true,
    });
  }

  async createPrescription(input: CreatePrescriptionInput, _doctorId: string) {
    const prescription = this.prescriptionRepo.create({
      appointment: { id: input.appointmentId },
      status: PrescriptionStatus.Draft,
    });
    await this.prescriptionRepo.save(prescription);

    const items = input.items.map((i) =>
      this.itemRepo.create({ ...i, prescription }),
    );
    await this.itemRepo.save(items);

    return prescription;
  }

  async signPrescription(
    prescriptionId: string,
    doctorId: string,
  ): Promise<Prescription> {
    // 1️⃣ Récupération de la prescription avec relations
    const prescription = await this.prescriptionRepo.findOne({
      where: { id: prescriptionId },
      relations: [
        'appointment',
        'appointment.medecin',
        'items',
        'doctorSignature',
      ],
    });
    if (!prescription) throw new NotFoundException('Prescription not found');
    if (prescription.appointment.medecin.id !== doctorId)
      throw new ForbiddenException('Not allowed');

    // 2️⃣ Création du bundle JSON pour hash/signature
    const jsonBundle = {
      id: prescription.id,
      appointmentId: prescription.appointment.id,
      doctorId,
      items: prescription.items.map((i) => ({
        code: i.code,
        denomination: i.denomination,
        dosage: i.dosage,
        forme: i.forme,
        posologie: i.posologie,
        dureeJours: i.dureeJours,
        renouvellement: i.renouvellement,
      })),
    };
    const jsonStr = JSON.stringify(jsonBundle);

    // 3️⃣ Génération du PDF
    const pdfBuffer = await generatePrescriptionPDF(prescription, doctorId);

    // 4️⃣ Hash combiné JSON + PDF
    const hash = hashBuffer(Buffer.concat([Buffer.from(jsonStr), pdfBuffer]));

    // 5️⃣ Signature électronique
    const { signature, tsaToken } = await this.certProvider.signHashP256(
      hash,
      doctorId,
    );
    const { certificateChain } =
      await this.certProvider.getCertificateForDoctor(doctorId);

    // 6️⃣ Upload PDF sur S3/MinIO
    const pdfKey = `prescriptions/${prescription.id}.pdf`;
    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.MINIO_BUCKET!,
        Key: pdfKey,
        Body: pdfBuffer,
      }),
    );

    // 7️⃣ Création de la signature du médecin
    const doctorSignature = this.signatureRepo.create({
      doctor: prescription.appointment.medecin,
      prescriptions: [prescription], // ⬅️ OneToMany
      signatureBlob: signature.toString('base64'),
      certificateChain: certificateChain.join(','),
      tsaToken,
      signedAt: new Date(),
      signatureType: SignatureType.QES,
    });

    await this.signatureRepo.save(doctorSignature);

    // 8️⃣ Mise à jour de la prescription
    prescription.doctorSignature = doctorSignature;
    prescription.status = PrescriptionStatus.Signed;
    prescription.pdfUrl = `s3://${process.env.MINIO_BUCKET!}/${pdfKey}`;
    prescription.jsonPayload = jsonStr;
    prescription.hash = hash.toString('hex');

    await this.prescriptionRepo.save(prescription);

    return prescription;
  }

  async getPrescription(id: string) {
    return this.prescriptionRepo.findOne({
      where: { id },
      relations: [
        'items',
        'doctorSignature',
        'appointment',
        'appointment.medecin',
      ],
    });
  }
}
