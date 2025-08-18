import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Medecin } from '../../entities/medecin.entity';
import { Patient } from '../../entities/patient.entity';
import { PaymentType } from './payment.type';

@ObjectType()
export class AppointmentType {
  @Field(() => ID)
  id!: string;

  @Field(() => Patient)
  patient!: Patient;

  @Field(() => Medecin)
  medecin!: Medecin;

  @Field()
  start!: Date;

  @Field()
  end!: Date;

  @Field()
  status!: string;

  @Field()
  mode!: 'présentiel' | 'visio';

  @Field(() => PaymentType)
  payment!: PaymentType;
}
