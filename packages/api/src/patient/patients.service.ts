import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(@InjectRepository(Patient) private repo: Repository<Patient>) {}

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
}
