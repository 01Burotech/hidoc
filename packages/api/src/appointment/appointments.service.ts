import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { Payment } from '../entities/payment.entity';
import { BookAppointmentInput } from './dto/book-appointment.input';
import { Medecin } from '../entities/medecin.entity';
import { Patient } from '../entities/patient.entity';
import { PaymentStatus, AppointmentStatus, Mode } from '../entities/enums';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly repo: Repository<Appointment>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  /** Crée un rendez-vous et génère un paiement lié */
  async book(
    input: BookAppointmentInput,
    patient: Patient,
    doctor: Medecin,
  ): Promise<Appointment> {
    const isWeekend = [0, 6].includes(new Date(input.start).getDay());
    const finalTarif =
      doctor.tarifs * (isWeekend ? 1 + doctor.weekendPremium / 100 : 1);

    // Création type-safe du rendez-vous
    const appt = new Appointment();
    appt.patient = patient;
    appt.medecin = doctor;
    appt.start = input.start;
    appt.end = input.end;
    appt.mode = input.mode === 'visio' ? Mode.Visio : Mode.Presentiel; // ou Mode.Visio selon le contexte
    appt.status = AppointmentStatus.Pending;

    const saved = await this.repo.save(appt);

    // Création type-safe du paiement
    const payment = new Payment();
    payment.patient = patient;
    payment.doctor = doctor;
    payment.amount = finalTarif;
    payment.currency = 'EUR';
    payment.provider = 'stripe';
    payment.status = PaymentStatus.RequiresPaymentMethod;
    payment.metadata = { appointmentId: saved.id };
    payment.appointment = saved;

    await this.paymentRepo.save(payment);

    saved.payment = payment;
    return saved;
  }

  /** Annule un rendez-vous */
  async cancel(appointmentId: string, _reason?: string): Promise<Appointment> {
    const appt = await this.repo.findOne({ where: { id: appointmentId } });
    if (!appt) throw new BadRequestException('Appointment not found');
    appt.status = AppointmentStatus.Cancelled;
    return this.repo.save(appt);
  }

  /** Démarre une téléconsultation */
  async startTeleconsultation(appointmentId: string) {
    const appt = await this.repo.findOne({ where: { id: appointmentId } });
    if (!appt) throw new BadRequestException('Appointment not found');
    appt.status = AppointmentStatus.Confirmed;
    await this.repo.save(appt);
    return {
      appointmentId,
      sessionUrl: `https://telemed.example.com/${appointmentId}`,
    };
  }

  /** Retourne un clientSecret pour le paiement (placeholder) */
  async paymentIntent(appointmentId: string) {
    const appt = await this.repo.findOne({
      where: { id: appointmentId },
      relations: ['payment'],
    });
    if (!appt || !appt.payment)
      throw new BadRequestException('Appointment or payment not found');
    return { id: appt.payment.id, clientSecret: `pi_${appt.id}_secret_dummy` };
  }
}
