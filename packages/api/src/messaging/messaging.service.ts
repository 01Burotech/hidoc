import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { SendMessageInput } from './dto/send-message.input';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(Message) private msgRepo: Repository<Message>,
  ) {}

  async sendMessage(input: SendMessageInput): Promise<Message> {
    const msg = this.msgRepo.create({
      ...input,
      createdAt: new Date(),
    });
    return this.msgRepo.save(msg);
  }

  async messagesByThread(threadId: string): Promise<Message[]> {
    const msgs = await this.msgRepo.find({
      where: { threadId },
      order: { id: 'ASC' },
    });
    if (!msgs.length) throw new NotFoundException('No messages found');
    return msgs;
  }
}
