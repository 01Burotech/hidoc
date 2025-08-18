import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../entities/appointment.entity';
import { Payment } from '../entities/payment.entity';
import { PaymentsService } from './payments.service';
import { PaymentsResolver } from './payments.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Appointment])],
  providers: [PaymentsService, PaymentsResolver],
  exports: [PaymentsService],
})
export class PaymentsModule {}
