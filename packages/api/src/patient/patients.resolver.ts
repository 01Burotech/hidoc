import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PatientsService } from './patients.service';
import { Patient } from '../entities/patient.entity';

@Resolver(() => Patient)
export class PatientsResolver {
  constructor(private patientsService: PatientsService) {}

  @Query(() => Patient, { nullable: true })
  patientByUser(@Args('userId') userId: string) {
    return this.patientsService.findById(userId);
  }

  @Mutation(() => Patient)
  updateDossiers(
    @Args('patientId') patientId: string,
    @Args('dossiers') dossiers: string,
  ) {
    return this.patientsService.updateDossiers(patientId, JSON.parse(dossiers));
  }

  @Mutation(() => Patient)
  addAssurance(
    @Args('patientId') patientId: string,
    @Args('assurance') assurance: string,
  ) {
    return this.patientsService.addAssurance(patientId, assurance);
  }
}
