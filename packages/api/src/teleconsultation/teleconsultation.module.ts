import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../entities/appointment.entity';
import { TeleconsultationService } from './teleconsultation.service';
import { TeleconsultationResolver } from './teleconsultation.resolver';
import { MockVideoProvider } from './providers/mock-video.provider';
import { DailyAdapterProvider } from './providers/daily-adapter.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
  providers: [
    TeleconsultationService,
    TeleconsultationResolver,
    { provide: 'IVideoProvider', useClass: MockVideoProvider }, // switch to DailyAdapterProvider if needed
  ],
})
export class TeleconsultationModule {}
