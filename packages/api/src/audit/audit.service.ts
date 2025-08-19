import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(@InjectRepository(AuditLog) private repo: Repository<AuditLog>) {}

  async log(
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
  ) {
    const entry = this.repo.create({
      action,
      entityType,
      entityId,
      timestamp: new Date(),
    });
    await this.repo.save(entry);
    return entry;
  }
}
