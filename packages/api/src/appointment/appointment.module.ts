import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/entities/appointment.entity';
import { Medecin } from 'src/entities/medecin.entity';
import { Patient } from 'src/entities/patient.entity';
import { Payment } from 'src/entities/payment.entity';
import { Prescription } from 'src/entities/prescription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      Payment,
      Prescription,
      Patient,
      Medecin,
    ]),
  ],
  providers: [],
  exports: [],
})
export class AppointmentModule {}
