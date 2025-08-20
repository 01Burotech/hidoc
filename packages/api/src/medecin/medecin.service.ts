import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Medecin } from '../entities/medecin.entity';
import { Availability } from '../entities/availability.entity';
import { SearchMedecinsInput } from './dto/search-medecins.input';
import { Specialite } from 'src/entities/specialite.entity';

@Injectable()
export class MedecinService {
  constructor(
    @InjectRepository(Medecin)
    private medecinRepository: Repository<Medecin>,
    @InjectRepository(Availability)
    private availRepository: Repository<Availability>,
    @InjectRepository(Specialite)
    private specialiteRepository: Repository<Specialite>,
  ) {}

  async createDemoMedecin(partial: Partial<Medecin>): Promise<Medecin> {
    const medecin = this.medecinRepository.create(partial);

    // Si des noms de specialités sont passés dans partial.specialites
    if (partial.specialites && partial.specialites.length > 0) {
      // On récupère les entités Specialite correspondantes
      const specialites = await this.specialiteRepository.findBy({
        nom: In(partial.specialites ? partial.specialites : []),
      });
      medecin.specialites = specialites;
    }

    return this.medecinRepository.save(medecin);
  }

  async findById(id: string): Promise<Medecin | null> {
    return this.medecinRepository.findOne({ where: { id } });
  }

  async search(input: SearchMedecinsInput): Promise<Medecin[]> {
    const { specialite, date, weekendOnly } = input;
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const qb = this.medecinRepository
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.user', 'user')
      .leftJoinAndSelect(
        'd.availabilities',
        'a',
        'a.start >= :start AND a.end <= :end',
        { start, end },
      );

    if (specialite) {
      qb.andWhere(':specialite = ANY(d.specialites)', { specialite });
    }

    if (weekendOnly) {
      qb.andWhere('a.type = :type', { type: 'weekend' });
    }

    qb.orderBy('d.tarifs', 'ASC');

    const medecins = await qb.getMany();
    return medecins.map((d) => ({
      ...d,
      availabilities: d.availabilities ?? [],
    }));
  }

  async medecinAvailabilities(
    medecinId: string,
    from: Date,
    to: Date,
  ): Promise<Availability[]> {
    return this.availRepository.find({
      where: { medecin: { id: medecinId }, start: Between(from, to) },
      order: { start: 'ASC' },
    });
  }
}
