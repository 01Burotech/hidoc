import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { MessagingService } from './messaging.service';
import { Message } from '../entities/message.entity';
import { SendMessageInput } from './dto/send-message.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Resolver(() => Message)
export class MessagingResolver {
  constructor(private svc: MessagingService) {}

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async sendMessage(
    @Args('input') input: SendMessageInput,
    @CurrentUser('id') userId: string,
  ) {
    return this.svc.sendMessage(input);
  }

  @Query(() => [Message])
  @UseGuards(GqlAuthGuard)
  async messagesByThread(@Args('threadId') threadId: string) {
    return this.svc.messagesByThread(threadId);
  }
}
