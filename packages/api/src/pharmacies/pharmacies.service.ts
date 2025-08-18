import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pharmacie } from '../entities/pharmacie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PharmaciesService {
  constructor(
    @InjectRepository(Pharmacie) private repo: Repository<Pharmacie>,
  ) {}

  async findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  // Haversine formula fallback in SQL
  async nearby(lat: number, lng: number, radiusKm = 10) {
    // lat/lng stored as numeric strings; cast to double precision
    const q = this.repo.createQueryBuilder('p').where(
      `(
        6371 * acos(
          least(1.0, cos(radians(:lat)) * cos(radians(p.lat::double precision)) * cos(radians(p.lng::double precision) - radians(:lng)) + sin(radians(:lat)) * sin(radians(p.lat::double precision)))
        )
      ) <= :radius`,
      { lat, lng, radius: radiusKm },
    );
    return q.getMany();
  }

  async createDemo(ph: Partial<Pharmacie>) {
    const p = this.repo.create(ph);
    return this.repo.save(p);
  }
}
