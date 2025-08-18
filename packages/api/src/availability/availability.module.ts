import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Availability } from '../entities/availability.entity';
import { AvailabilityService } from './availability.service';
import { AvailabilityResolver } from './availability.resolver';
import { Appointment } from 'src/entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Availability, Appointment])],
  providers: [AvailabilityService, AvailabilityResolver],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
