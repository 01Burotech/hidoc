import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { PharmacyDispatchService } from './pharmacy-dispatch.service';
import { PharmacyDispatch } from '../../entities/pharmacy-dispatch.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { SendPrescriptionInput } from '../dto/send-prescription.input';
import { PharmacyDispatchStatus } from 'src/entities/enums';

@Resolver(() => PharmacyDispatch)
export class PharmacyDispatchResolver {
  constructor(private svc: PharmacyDispatchService) {}

  @Mutation(() => PharmacyDispatch)
  @UseGuards(GqlAuthGuard)
  async sendPrescriptionToPharmacy(
    @Args('input') input: SendPrescriptionInput,
    @Args('jwtToken') jwtToken: string,
  ) {
    return this.svc.sendToPharmacy(input, jwtToken);
  }

  @Mutation(() => PharmacyDispatch)
  @UseGuards(GqlAuthGuard)
  async acceptPharmacyDispatch(
    @Args('dispatchId') dispatchId: string,
    @Args('status') status: PharmacyDispatchStatus.Accepted,
  ) {
    return this.svc.acceptDispatch(dispatchId, status);
  }
}
