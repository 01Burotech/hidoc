import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { User } from '../../entities/user.entity';
import { Availability } from '../../entities/availability.entity';

@ObjectType()
export class MedecinType {
  @Field(() => ID)
  id!: string;

  @Field(() => User)
  user!: User;

  @Field(() => [String])
  specialites!: string[];

  @Field(() => [String])
  lieux!: string[];

  @Field(() => Int)
  tarifs!: number;

  @Field(() => Int)
  weekendPremium!: number;

  @Field(() => [Availability])
  availabilities!: Availability[];
}
