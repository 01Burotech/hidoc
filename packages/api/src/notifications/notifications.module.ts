import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationService } from './notification.service';
import { ExpoAdapter } from './adapters/expo.adapter';
import { EmailAdapter } from './adapters/email.adapter';
import { SmsAdapter } from './adapters/sms.adapter';

@Module({
  imports: [BullModule.registerQueue({ name: 'notifications' })],
  providers: [NotificationService, ExpoAdapter, EmailAdapter, SmsAdapter],
  exports: [NotificationService],
})
export class NotificationsModule {}
