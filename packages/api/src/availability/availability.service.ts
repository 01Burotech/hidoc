import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Availability } from '../entities/availability.entity';
import { CreateAvailabilityInput } from './dto/create-availability.input';
import { Medecin } from '../entities/medecin.entity';
import { AvailabilityType } from '../entities/enums';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private readonly repo: Repository<Availability>,
  ) {}

  async create(
    input: CreateAvailabilityInput,
    doctor: Medecin,
  ): Promise<Availability[]> {
    const { start, end, type: inputType, recurring } = input;

    if (start >= end) throw new BadRequestException('Start must be before end');

    // Cast sûr vers l'enum AvailabilityType
    const type = inputType as AvailabilityType;
    if (!Object.values(AvailabilityType).includes(type)) {
      throw new BadRequestException('Invalid availability type');
    }

    const availabilities: Availability[] = [];
    const days = recurring ? 7 : 1;

    for (let i = 0; i < days; i++) {
      const s = new Date(start);
      s.setDate(s.getDate() + i);
      const e = new Date(end);
      e.setDate(e.getDate() + i);

      // Crée une instance de Availability correctement typée
      const avail = this.repo.create({
        medecin: doctor, // bien typé
        start: s,
        end: e,
        type,
        capacity: 1,
      });

      availabilities.push(avail);
    }

    return this.repo.save(availabilities);
  }

  async findDoctorAvailabilities(
    doctorId: string,
    from: Date,
    to: Date,
  ): Promise<Availability[]> {
    return this.repo.find({
      where: { medecin: { id: doctorId }, start: Between(from, to) },
      order: { start: 'ASC' },
    });
  }
}
