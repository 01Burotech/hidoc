import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1723907500000 implements MigrationInterface {
  name = 'Initial1723907500000';

  public async up(_queryRunner: QueryRunner): Promise<void> {
    // Initial empty migration
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Rollback logic
  }
}
