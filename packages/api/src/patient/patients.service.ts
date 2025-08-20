import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { PatientSensitive } from './patient-sensitive.entity';
import { PatientConsent } from './patient-consent.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient) private repo: Repository<Patient>,
    @InjectRepository(PatientSensitive)
    private sensitiveRepo: Repository<PatientSensitive>,
    @InjectRepository(PatientConsent)
    private consentRepo: Repository<PatientConsent>,
  ) {}

  async findById(id: string): Promise<Patient> {
    const patient = await this.repo.findOne({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  async updateDossiers(
    patientId: string,
    dossiers: Record<string, unknown>,
  ): Promise<Patient> {
    const patient = await this.findById(patientId);
    patient.dossiers = dossiers;
    return this.repo.save(patient);
  }

  async addAssurance(patientId: string, assurance: string): Promise<Patient> {
    const patient = await this.findById(patientId);
    patient.assurances = [...(patient.assurances || []), assurance];
    return this.repo.save(patient);
  }

  async getSensitive(
    patientId: string,
    userId: string,
    userRole: string,
  ): Promise<PatientSensitive> {
    if (userRole !== 'Admin' && userId !== patientId)
      throw new ForbiddenException();
    const entry = await this.sensitiveRepo.findOne({ where: { patientId } });
    if (!entry) throw new NotFoundException();
    return entry;
  }

  async saveSensitive(
    patientId: string,
    data: Record<string, any>,
  ): Promise<PatientSensitive> {
    const entry = this.sensitiveRepo.create({ patientId, data });
    return this.sensitiveRepo.save(entry);
  }

  async consent(patientId: string, scope: string) {
    const entry = this.consentRepo.create({ patientId, scope, granted: true });
    return this.consentRepo.save(entry);
  }

  async revoke(patientId: string, scope: string) {
    const entry = this.consentRepo.create({ patientId, scope, granted: false });
    return this.consentRepo.save(entry);
  }

  async hasConsent(patientId: string, scope: string): Promise<boolean> {
    const entry = await this.consentRepo.findOne({
      where: { patientId, scope, granted: true },
    });
    return !!entry;
  }
}
