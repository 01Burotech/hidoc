import { ObjectType, Field, ID } from "@nestjs/graphql";
import { User } from "../../entities/user.entity";

@ObjectType()
export class PatientType {
  @Field(() => ID)
  id!: string;

  @Field(() => User)
  user!: User;

  @Field({ nullable: true })
  dateNaissance?: string;

  @Field(() => [String])
  assurances!: string[];
}
