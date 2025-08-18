import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { PaymentsService } from './payments.service';
import { Payment } from '../entities/payment.entity';

@Resolver(() => Payment)
export class PaymentsResolver {
  constructor(private svc: PaymentsService) {}

  @Mutation(() => Payment)
  paymentIntent(@Args('appointmentId') appointmentId: string) {
    return this.svc.createPaymentIntent(appointmentId);
  }
}
