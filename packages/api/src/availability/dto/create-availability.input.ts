import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAvailabilityInput {
  @Field()
  start!: Date;

  @Field()
  end!: Date;

  @Field()
  type!: 'weekend' | 'weekday';

  @Field({ nullable: true })
  recurring?: boolean;
}
