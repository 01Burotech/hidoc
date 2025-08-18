import { Controller, Post, Param, Body, Headers } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Prescription } from '../entities/prescription.entity';
import { PharmacyDispatch } from '../entities/pharmacy-dispatch.entity';
import { PharmacyDispatchStatus } from 'src/entities/enums';

@Controller('/mock/pharmacy')
export class PharmacyMockController {
  private received: PharmacyDispatch[] = [];

  constructor(
    @InjectPinoLogger(PharmacyMockController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Post(':id/prescriptions')
  async receivePrescription(
    @Param('id') id: string,
    @Body() body: { prescription: Prescription },
    @Headers('authorization') auth: string,
  ) {
    if (!auth) return { status: 'unauthorized' };

    const now = new Date();

    const dispatch: PharmacyDispatch = {
      id: `mock-${Date.now()}`,
      prescription: body.prescription,
      pharmacie: { id } as any,
      status: PharmacyDispatchStatus.Received,
      createdAt: now,
      updatedAt: now,
      receivedAt: now,
      acceptedAt: null,
      preparedAt: null,
      dispensedAt: null,
    };

    this.received.push(dispatch);

    this.logger.info(
      `Mock pharmacy ${id} received prescription ${body.prescription.id}`,
    );

    return { status: 'ok', dispatchId: dispatch.id };
  }
}
