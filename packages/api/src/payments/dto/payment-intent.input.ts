import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PaymentIntentInput {
  @Field()
  appointmentId!: string;
}
