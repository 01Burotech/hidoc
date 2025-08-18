import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../entities/appointment.entity';
import { Payment } from '../entities/payment.entity';
import { AppointmentsService } from './appointments.service';
import { AppointmentsResolver } from './appointments.resolver';
import { MedecinModule } from 'src/medecin/medecin.module';
import { PatientsModule } from 'src/patient/patient.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Payment]),
    MedecinModule,
    PatientsModule,
  ],
  providers: [AppointmentsService, AppointmentsResolver],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
