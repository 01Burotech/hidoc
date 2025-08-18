import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/entities/appointment.entity';
import { Availability } from 'src/entities/availability.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Availability, Appointment])],
})
export class AvailabilityModule {}
