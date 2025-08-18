import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class SendMessageInput {
  @Field(() => ID, { nullable: true })
  threadId?: string;

  @Field(() => [ID])
  participants!: string[];

  @Field()
  body!: string;

  @Field(() => [String], { nullable: true })
  attachments?: string[];
}
