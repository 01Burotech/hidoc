import { Controller, Post, Req, Res } from '@nestjs/common';
import { TeleconsultationService } from '../teleconsultation/teleconsultation.service';

@Controller('webhooks/video/provider')
export class VideoWebhookController {
  constructor(private svc: TeleconsultationService) {}

  @Post()
  async handle(@Req() req: any, @Res() res: any) {
    await this.svc.handleWebhook(req.body);
    res.status(200).send({ received: true });
  }
}
