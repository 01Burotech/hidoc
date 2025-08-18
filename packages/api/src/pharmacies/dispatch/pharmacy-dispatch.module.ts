import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PharmacyDispatch } from '../../entities/pharmacy-dispatch.entity';
import { PrescriptionsModule } from '../../prescriptions/prescriptions.module';
import { PharmacyDispatchService } from './pharmacy-dispatch.service';
import { PharmacyDispatchResolver } from './pharmacy-dispatch.resolver';
import { HttpPharmacyAdapter } from '../adapter/http-pharmacy.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([PharmacyDispatch]), PrescriptionsModule],
  providers: [
    PharmacyDispatchService,
    PharmacyDispatchResolver,
    { provide: 'IPharmacyAdapter', useClass: HttpPharmacyAdapter },
  ],
})
export class PharmacyDispatchModule {}
