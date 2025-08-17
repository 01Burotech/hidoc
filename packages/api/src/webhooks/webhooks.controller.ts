import { Controller, Post, Param, Body } from '@nestjs/common';

@Controller('webhooks')
export class WebhooksController {
  @Post('stripe')
  handleStripe(@Body() payload: any) {
    console.log('Stripe webhook:', payload);
    return { received: true, provider: 'stripe' };
  }

  @Post('video/provider')
  handleVideoProvider(@Body() payload: any) {
    console.log('Video webhook:', payload);
    return { received: true, provider: 'video' };
  }

  @Post('pharmacy/:id/ack')
  handlePharmacyAck(@Param('id') id: string, @Body() payload: any) {
    console.log('Pharmacy webhook:', payload);
    return { received: true, pharmacyId: id };
  }
}
