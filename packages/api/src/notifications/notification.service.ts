import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ExpoAdapter } from './adapters/expo.adapter';
import { EmailAdapter } from './adapters/email.adapter';
import { SmsAdapter } from './adapters/sms.adapter';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue('notifications') private queue: Queue,
    private expo: ExpoAdapter,
    private email: EmailAdapter,
    private sms: SmsAdapter,
  ) {}

  async notifyPush(tokens: string[], title: string, body: string) {
    await this.queue.add('push', { tokens, title, body });
  }

  async notifyEmail(to: string, subject: string, html: string) {
    await this.queue.add('email', { to, subject, html });
  }

  async notifySms(to: string, body: string) {
    await this.queue.add('sms', { to, body });
  }

  // Workers would process queue items and call respective adapters
}
