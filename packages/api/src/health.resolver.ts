import { Resolver, Query, ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class HealthStatus {
  @Field()
  status!: string; // ✅ "!" dit à TS que la propriété sera bien assignée
}

@Resolver()
export class HealthResolver {
  @Query(() => HealthStatus)
  check(): HealthStatus {
    return { status: 'ok' };
  }
}
