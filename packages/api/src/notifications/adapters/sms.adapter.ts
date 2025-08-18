import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsAdapter {
  private readonly logger = new Logger(SmsAdapter.name);

  async sendSms(to: string, body: string) {
    this.logger.log(`Sending SMS to ${to}: ${body}`);
    return true;
  }
}
