import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { PrescriptionsService } from './prescriptions.service';
import { Prescription } from '../entities/prescription.entity';
import { CreatePrescriptionInput } from './dto/create-prescription.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => Prescription)
export class PrescriptionsResolver {
  constructor(private svc: PrescriptionsService) {}

  @Mutation(() => Prescription)
  @UseGuards(GqlAuthGuard)
  async createPrescription(
    @Args('input') input: CreatePrescriptionInput,
    @Context('user') user: any,
  ) {
    return this.svc.createPrescription(input, user.id);
  }

  @Mutation(() => Prescription)
  @UseGuards(GqlAuthGuard)
  async signPrescription(
    @Args('prescriptionId') prescriptionId: string,
    @Context('user') user: any,
  ) {
    return this.svc.signPrescription(prescriptionId, user.id);
  }

  @Query(() => Prescription)
  @UseGuards(GqlAuthGuard)
  async prescription(@Args('id') id: string) {
    return this.svc.getPrescription(id);
  }
}
