import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AvailabilityService } from './availability.service';
import { AvailabilityDTO } from './dto/availability.type';
import { CreateAvailabilityInput } from './dto/create-availability.input';
import { Medecin } from '../entities/medecin.entity';

@Resolver(() => AvailabilityDTO)
export class AvailabilityResolver {
  constructor(private svc: AvailabilityService) {}

  @Mutation(() => [AvailabilityDTO])
  createAvailability(
    @Args('input') input: CreateAvailabilityInput,
    @Args('doctorId') doctorId: string,
  ) {
    const doctor = { id: doctorId } as Medecin;
    return this.svc.create(input, doctor);
  }

  @Query(() => [AvailabilityDTO])
  doctorAvailabilities(
    @Args('doctorId') doctorId: string,
    @Args('from') from: string,
    @Args('to') to: string,
  ) {
    return this.svc.findDoctorAvailabilities(
      doctorId,
      new Date(from),
      new Date(to),
    );
  }
}
