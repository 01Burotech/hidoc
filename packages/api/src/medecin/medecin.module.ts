import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Availability } from 'src/entities/availability.entity';
import { Medecin } from 'src/entities/medecin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Medecin, Availability])],
})
export class MedecinModule {}
