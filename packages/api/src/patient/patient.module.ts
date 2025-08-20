import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '../entities/patient.entity';
import { UsersModule } from '../users/users.module';
import { PatientsService } from './patients.service';
import { PatientsResolver } from './patients.resolver';
import { PatientConsent } from './patient-consent.entity';
import { PatientSensitive } from './patient-sensitive.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, PatientConsent, PatientSensitive]),
    UsersModule,
  ],
  providers: [PatientsService, PatientsResolver],
  exports: [PatientsService],
})
export class PatientsModule {}
