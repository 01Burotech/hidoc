import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescription } from '../entities/prescription.entity';
import { PrescriptionItem } from '../entities/prescription-item.entity';
import { DoctorSignature } from '../entities/doctor-signature.entity';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsResolver } from './prescriptions.resolver';
import { SignatureModule } from '../signature/signature.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prescription, PrescriptionItem, DoctorSignature]),
    SignatureModule,
  ],
  providers: [PrescriptionsService, PrescriptionsResolver],
  exports: [PrescriptionsService],
})
export class PrescriptionsModule {}
