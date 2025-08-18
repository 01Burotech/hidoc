import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { TeleconsultationService } from './teleconsultation.service';
import { Appointment } from '../entities/appointment.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => Appointment)
export class TeleconsultationResolver {
  constructor(private svc: TeleconsultationService) {}

  @Mutation(() => Appointment)
  @UseGuards(GqlAuthGuard)
  async startTeleconsultation(
    @Args('appointmentId') appointmentId: string,
    @Context('user') user: any,
  ) {
    const { roomId, url, token } = await this.svc.startSession(
      appointmentId,
      user.id,
      user.role === 'Medecin' ? 'doctor' : 'patient',
    );
    return { ...user, teleconsultation: { roomId, url, token } };
  }
}
