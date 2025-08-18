import { Resolver, Query, Args } from '@nestjs/graphql';
import { MedecinService } from './medecin.service';
import { SearchMedecinsInput } from './dto/search-medecins.input';
import { Availability } from '../entities/availability.entity';
import { UseInterceptors } from '@nestjs/common';
import { RedisCacheInterceptor } from '../common/interceptors/redis-cache.interceptor';
import { Medecin } from 'src/entities/medecin.entity';

@Resolver(() => Medecin)
export class MedecinResolver {
  constructor(private medecinService: MedecinService) {}

  @Query(() => [Medecin])
  @UseInterceptors(RedisCacheInterceptor)
  async searchMedecins(
    @Args('specialite') specialite: string,
    @Args('date') date: string,
    @Args('weekendOnly', { nullable: true }) weekendOnly?: boolean,
  ) {
    const input: SearchMedecinsInput = {
      specialite,
      date: new Date(date),
      weekendOnly,
    };
    return this.medecinService.search(input);
  }

  @Query(() => [Availability])
  async MediaCapabilities(
    @Args('medecinId') medecinId: string,
    @Args('from') from: string,
    @Args('to') to: string,
  ) {
    return this.medecinService.medecinAvailabilities(
      medecinId,
      new Date(from),
      new Date(to),
    );
  }
}
