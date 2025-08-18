import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pharmacie } from '../entities/pharmacie.entity';
import { PharmaciesService } from './pharmacies.service';
import { PharmaciesResolver } from './pharmacies.resolver';
import { PharmacyDispatch } from 'src/entities/pharmacy-dispatch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pharmacie, PharmacyDispatch])],
  providers: [PharmaciesService, PharmaciesResolver],
  exports: [PharmaciesService],
})
export class PharmaciesModule {}
