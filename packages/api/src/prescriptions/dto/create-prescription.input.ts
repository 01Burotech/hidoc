import { InputType, Field } from '@nestjs/graphql';
import { PrescriptionItemInput } from './prescription-item.input';

@InputType()
export class CreatePrescriptionInput {
  @Field()
  appointmentId!: string;

  @Field(() => [PrescriptionItemInput])
  items!: PrescriptionItemInput[];
}
