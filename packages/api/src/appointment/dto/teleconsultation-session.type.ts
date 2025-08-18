import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TeleconsultationSessionType {
  @Field()
  appointmentId!: string;

  @Field()
  sessionUrl!: string;
}
