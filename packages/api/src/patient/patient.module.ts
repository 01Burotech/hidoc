import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '../entities/patient.entity';
import { UsersModule } from '../users/users.module';
import { PatientsService } from './patients.service';
import { PatientsResolver } from './patients.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Patient]), UsersModule],
  providers: [PatientsService, PatientsResolver],
  exports: [PatientsService],
})
export class PatientsModule {}
