import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AppointmentsService } from './appointments.service';
import { AppointmentType } from './dto/appointment.type';
import { BookAppointmentInput } from './dto/book-appointment.input';
import { TeleconsultationSessionType } from './dto/teleconsultation-session.type';
import { PaymentType } from './dto/payment.type';

@Resolver()
export class AppointmentsResolver {
  constructor(private svc: AppointmentsService) {}

  @Mutation(() => AppointmentType)
  bookAppointment(
    @Args('input') input: BookAppointmentInput,
    @Args('patientId') patientId: string,
    @Args('doctorId') doctorId: string,
  ) {
    const patient = { id: patientId } as any;
    const doctor = { id: doctorId, tarifs: 100, weekendPremium: 20 } as any;
    return this.svc.book(input, patient, doctor);
  }

  @Mutation(() => AppointmentType)
  cancelAppointment(
    @Args('appointmentId') appointmentId: string,
    @Args('reason', { nullable: true }) reason?: string,
  ) {
    return this.svc.cancel(appointmentId, reason);
  }

  @Mutation(() => TeleconsultationSessionType)
  startTeleconsultation(@Args('appointmentId') appointmentId: string) {
    return this.svc.startTeleconsultation(appointmentId);
  }

  @Query(() => PaymentType)
  paymentIntent(@Args('appointmentId') appointmentId: string) {
    return this.svc.paymentIntent(appointmentId);
  }
}
