import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';
import { MessagingService } from './messaging.service';
import { MessagingResolver } from './messaging.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [MessagingService, MessagingResolver],
  exports: [MessagingService],
})
export class MessagingModule {}
