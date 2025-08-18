import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SendPrescriptionInput {
  @Field() prescriptionId!: string;
  @Field() pharmacyId!: string;
}
