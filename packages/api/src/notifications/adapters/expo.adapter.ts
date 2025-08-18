import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ExpoAdapter {
  private readonly logger = new Logger(ExpoAdapter.name);

  async sendPush(tokens: string[], message: { title: string; body: string }) {
    tokens.forEach((t) =>
      this.logger.log(
        `Sending push to ${t}: ${message.title} - ${message.body}`,
      ),
    );
    return true;
  }
}
