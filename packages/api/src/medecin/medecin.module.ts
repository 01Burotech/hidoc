import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medecin } from '../entities/medecin.entity';
import { Availability } from '../entities/availability.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RedisCacheInterceptor } from '../common/interceptors/redis-cache.interceptor';
import { MedecinResolver } from './medecin.resolver';
import { MedecinService } from './medecin.service';
import { Specialite } from 'src/entities/specialite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Medecin, Availability, Specialite]),
    CacheModule.register(),
  ],
  providers: [
    MedecinService,
    MedecinResolver,
    {
      provide: APP_INTERCEPTOR,
      useClass: RedisCacheInterceptor,
    },
  ],
  exports: [MedecinService],
})
export class MedecinModule {}
