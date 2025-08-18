import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Medecin } from '../../entities/medecin.entity';

@ObjectType()
export class AvailabilityDTO {
  @Field(() => ID)
  id!: string;

  @Field(() => Medecin)
  medecin!: Medecin;

  @Field()
  start!: Date;

  @Field()
  end!: Date;

  @Field()
  type!: 'weekend' | 'weekday';

  @Field()
  capacity!: number;
}
