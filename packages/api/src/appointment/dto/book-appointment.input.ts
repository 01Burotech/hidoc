import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class BookAppointmentInput {
  @Field()
  start!: Date;

  @Field()
  end!: Date;

  @Field()
  mode!: 'présentiel' | 'visio';

  @Field({ nullable: true })
  paymentMethodId?: string;
}
