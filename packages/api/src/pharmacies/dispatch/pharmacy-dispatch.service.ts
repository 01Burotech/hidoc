import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PharmacyDispatch } from '../../entities/pharmacy-dispatch.entity';
import { PrescriptionsService } from '../../prescriptions/prescriptions.service';
import { SendPrescriptionInput } from '../dto/send-prescription.input';
import { PharmacyDispatchStatus } from 'src/entities/enums';

@Injectable()
export class PharmacyDispatchService {
  private readonly logger = new Logger(PharmacyDispatchService.name);

  constructor(
    @InjectRepository(PharmacyDispatch)
    private dispatchRepo: Repository<PharmacyDispatch>,
    private prescriptionsSvc: PrescriptionsService,
    @Inject('IPharmacyAdapter') private adapter: any,
  ) {}

  async sendToPharmacy(input: SendPrescriptionInput, jwtToken: string) {
    const prescription = await this.prescriptionsSvc.getPrescription(
      input.prescriptionId,
    );
    if (!prescription) throw new NotFoundException('Prescription not found');

    const sent = await this.adapter.sendPrescription(
      prescription,
      `https://pharmacy.api/${input.pharmacyId}`,
      jwtToken,
    );
    const dispatch = this.dispatchRepo.create({
      prescription,
      pharmacie: { id: input.pharmacyId } as any,
      status: sent
        ? PharmacyDispatchStatus.Received
        : PharmacyDispatchStatus.Rejected,
      receivedAt: sent ? new Date() : undefined,
    });
    await this.dispatchRepo.save(dispatch);

    this.logger.log(
      `Prescription ${prescription.id} sent to pharmacy ${input.pharmacyId}, status=${dispatch.status}`,
    );
    return dispatch;
  }

  async acceptDispatch(
    dispatchId: string,
    status: PharmacyDispatchStatus.Accepted,
  ) {
    const dispatch = await this.dispatchRepo.findOne({
      where: { id: dispatchId },
      relations: ['prescription'],
    });
    if (!dispatch) throw new NotFoundException('Dispatch not found');
    dispatch.status = status;
    await this.dispatchRepo.save(dispatch);
    return dispatch;
  }
}
