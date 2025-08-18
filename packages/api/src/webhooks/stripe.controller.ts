import {
  Controller,
  Post,
  Req,
  Res,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from '../payments/payments.service';
import Stripe from 'stripe';

@Controller('webhooks/stripe')
export class StripeWebhookController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  async handle(
    @Req() req: any,
    @Res() res: any,
    @Headers('stripe-signature') signature: string,
  ) {
    const rawBody = req.rawBody;
    let event: Stripe.Event;

    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET!, {
        apiVersion: '2025-07-30.basil' as unknown as Stripe.LatestApiVersion,
      });
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new HttpException(`Webhook error: ${message}`, HttpStatus.BAD_REQUEST);
    }

    await this.paymentsService.handleStripeEvent(event);
    res.status(200).send({ received: true });
  }
}
