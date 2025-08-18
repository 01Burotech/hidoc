import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class PharmacyType {
  @Field(() => ID)
  id!: string;

  @Field()
  nom!: string;

  @Field()
  adresse!: string;

  @Field()
  gln!: string;

  @Field()
  apiEndpoint!: string;

  @Field()
  publicKey!: string;

  @Field(() => Float)
  lat!: number;

  @Field(() => Float)
  lng!: number;
}
