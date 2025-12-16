import { Body, Controller, Headers, HttpCode, HttpStatus, Post, RawBody, UnauthorizedException } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  public constructor(private readonly webhookService: WebhookService) { }

  @Post('livekit')
  @HttpCode(HttpStatus.OK)
  public async receiveWebhookLivekit(
    @RawBody() body: string,
    @Headers('Authorization') authorization: string
  ) {
   
    if (!authorization) {
      throw new UnauthorizedException('Missing authorization header.')
    }

    return this.webhookService.receiveWebhookLivekit(body, authorization)
   
  }

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  public async receiveWebhookStripe(
    @RawBody() rowBody: string,
    @Headers('stripe-signature') sig: string
  ) {

    if (!sig) {
      throw new UnauthorizedException('Stripe signature invalid.')
    }

    const event = await this.webhookService.constructStripeEvent(rowBody, sig)

    await this.webhookService.receiveWebhookStripe(event)
  }
}
