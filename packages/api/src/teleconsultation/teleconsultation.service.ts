import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from '../entities/appointment.entity';
import { IVideoProvider } from './interfaces/video-provider.interface';
import { AppointmentStatus } from 'src/entities/enums';

@Injectable()
export class TeleconsultationService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @Inject('IVideoProvider') private videoProvider: IVideoProvider,
  ) {}

  async startSession(
    appointmentId: string,
    userId: string,
    role: 'patient' | 'doctor',
  ) {
    const appointment = await this.appointmentRepo.findOne({
      where: { id: appointmentId },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');

    if (
      (role === 'patient' && appointment.patient.id !== userId) ||
      (role === 'doctor' && appointment.medecin.id !== userId)
    ) {
      throw new ForbiddenException('Access denied');
    }

    const { roomId, url } = await this.videoProvider.createRoom(appointmentId);
    const token = await this.videoProvider.createToken(roomId, userId, role);

    appointment.status = AppointmentStatus.Confirmed; // optional: mark started
    await this.appointmentRepo.save(appointment);

    return { roomId, url, token };
  }

  async handleWebhook(event: any) {
    const { type, data } = event;
    const appointmentId = data.appointmentId;
    const appointment = await this.appointmentRepo.findOne({
      where: { id: appointmentId },
    });
    if (!appointment) return;

    if (type === 'room.ended') {
      appointment.status = AppointmentStatus.Completed;
      await this.appointmentRepo.save(appointment);
    }
  }
}
