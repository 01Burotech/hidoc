import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Medecin } from 'src/entities/medecin.entity';
import { Patient } from 'src/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Medecin, Patient])],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
