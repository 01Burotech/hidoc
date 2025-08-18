import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class PaymentType {
  @Field(() => ID)
  id!: string;

  @Field(() => Int)
  amount!: number;

  @Field()
  currency!: string;

  @Field()
  provider!: string;

  @Field()
  status!: string;

  @Field({ nullable: true })
  clientSecret?: string;
}
