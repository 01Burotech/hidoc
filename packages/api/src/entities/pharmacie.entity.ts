import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PharmacyDispatch } from './pharmacy-dispatch.entity';

@Entity({ name: 'pharmacies' })
@Index(['gln'], { unique: true })
@Index(['lat', 'lng'])
export class Pharmacie {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 200 })
  nom!: string;

  @Column({ type: 'text' })
  adresse!: string;

  @Column({ type: 'varchar', length: 64 })
  gln!: string;

  @Column({ type: 'varchar', length: 512 })
  apiEndpoint!: string;

  @Column({ type: 'text' })
  publicKey!: string;

  @Column({ type: 'numeric', precision: 9, scale: 6 })
  lat!: string;

  @Column({ type: 'numeric', precision: 9, scale: 6 })
  lng!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;

  @OneToMany(() => PharmacyDispatch, (d) => d.pharmacie)
  dispatches!: PharmacyDispatch[];
}
