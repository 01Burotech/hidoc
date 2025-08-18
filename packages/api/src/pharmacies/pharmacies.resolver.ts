import { Resolver, Query, Args } from '@nestjs/graphql';
import { PharmaciesService } from './pharmacies.service';
import { PharmacyType } from './dto/pharmacy.type';

@Resolver(() => PharmacyType)
export class PharmaciesResolver {
  constructor(private svc: PharmaciesService) {}

  @Query(() => [PharmacyType])
  pharmaciesNearby(
    @Args('lat') lat: number,
    @Args('lng') lng: number,
    @Args('radiusKm', { nullable: true, defaultValue: 10 }) radiusKm: number,
  ) {
    return this.svc.nearby(lat, lng, radiusKm);
  }
}
