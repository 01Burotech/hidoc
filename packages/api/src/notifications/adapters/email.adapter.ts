import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailAdapter {
  private readonly logger = new Logger(EmailAdapter.name);
  private transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 1025,
    ignoreTLS: true,
  });

  async sendEmail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: 'no-reply@hidoc.app',
      to,
      subject,
      html,
    });
    this.logger.log(`Sent email to ${to}: ${subject}`);
    return true;
  }
}
