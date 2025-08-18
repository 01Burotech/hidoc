import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PrescriptionItemInput {
  @Field() code!: string;
  @Field() denomination!: string;
  @Field() dosage!: string;
  @Field() forme!: string;
  @Field() posologie!: string;
  @Field() dureeJours!: number;
  @Field() renouvellement!: number;
}
