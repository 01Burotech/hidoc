import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { Appointment } from '../entities/appointment.entity';
import { PaymentStatus, AppointmentStatus } from '../entities/enums';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
  ) {
    // ⚡ Cast pour éviter l'erreur TS sur apiVersion
    this.stripe = new Stripe(process.env.STRIPE_SECRET!, {
      apiVersion: '2025-07-30.basil' as unknown as Stripe.LatestApiVersion,
    });
  }

  async createPaymentIntent(appointmentId: string): Promise<Payment> {
    const appointment = await this.appointmentRepo.findOne({
      where: { id: appointmentId },
    });
    if (!appointment) throw new BadRequestException('Appointment not found');

    // ✅ Création du paiement avec enum PaymentStatus
    const payment = this.paymentRepo.create({
      patient: appointment.patient,
      doctor: appointment.medecin,
      amount: appointment.medecin.tarifs,
      currency: 'EUR',
      provider: 'stripe',
      status: PaymentStatus.RequiresPaymentMethod,
      metadata: { appointmentId: appointment.id },
    });

    const savedPayment = await this.paymentRepo.save(payment);

    // ✅ Création du PaymentIntent Stripe
    const intent = await this.stripe.paymentIntents.create({
      amount: savedPayment.amount * 100,
      currency: savedPayment.currency.toLowerCase(),
      metadata: { appointmentId: appointment.id },
    });

    // ⚡ Ajout du clientSecret dans l'entité Payment
    savedPayment.clientSecret = intent.client_secret ?? undefined;
    await this.paymentRepo.save(savedPayment);

    return savedPayment;
  }

  async handleStripeEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent;
        const payment = await this.paymentRepo.findOne({
          where: { metadata: { appointmentId: pi.metadata.appointmentId } },
          relations: ['appointment'],
        });
        if (payment) {
          payment.status = PaymentStatus.Succeeded;
          if (payment.appointment)
            payment.appointment.status = AppointmentStatus.Confirmed;
          await this.paymentRepo.save(payment);
          if (payment.appointment)
            await this.appointmentRepo.save(payment.appointment);
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        const payment = await this.paymentRepo.findOne({
          where: { metadata: { appointmentId: pi.metadata.appointmentId } },
        });
        if (payment) {
          payment.status = PaymentStatus.Canceled;
          await this.paymentRepo.save(payment);
        }
        break;
      }
    }
  }

  async payoutDoctor(doctorId: string, amount: number) {
    // Placeholder pour futur transfert ou payout
    return { doctorId, amount, status: 'pending' };
  }
}
