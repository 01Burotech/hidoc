import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Prescription } from './prescription.entity';

@Entity({ name: 'prescription_items' })
@Index(['prescription'])
export class PrescriptionItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Prescription, (p) => p.items, { onDelete: 'CASCADE' })
  prescription!: Prescription;

  @Column({ type: 'varchar', length: 64, nullable: true })
  code?: string | null; // cisCode|atc

  @Column({ type: 'varchar', length: 256 })
  denomination!: string;

  @Column({ type: 'varchar', length: 128 })
  dosage!: string;

  @Column({ type: 'varchar', length: 128 })
  forme!: string;

  @Column({ type: 'varchar', length: 256 })
  posologie!: string;

  @Column({ type: 'int' })
  dureeJours!: number;

  @Column({ type: 'int', default: 0 })
  renouvellement!: number;
}
