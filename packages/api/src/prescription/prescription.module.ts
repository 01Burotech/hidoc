import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/entities/appointment.entity';
import { DoctorSignature } from 'src/entities/doctor-signature.entity';
import { PrescriptionItem } from 'src/entities/prescription-item.entity';
import { Prescription } from 'src/entities/prescription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Prescription,
      PrescriptionItem,
      DoctorSignature,
      Appointment,
    ]),
  ],
  providers: [],
  exports: [],
})
export class PrescriptionModule {}
