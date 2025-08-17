import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Prescription } from './prescription.entity';
import { Pharmacie } from './pharmacie.entity';
import { PharmacyDispatchStatus } from './enums';

@Entity({ name: 'pharmacy_dispatches' })
@Index(['pharmacie', 'prescription'], { unique: true })
export class PharmacyDispatch {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Prescription, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'prescription_id' })
  prescription!: Prescription;

  @ManyToOne(() => Pharmacie, (p) => p.dispatches, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'pharmacie_id' })
  pharmacie!: Pharmacie;

  @Column({
    type: 'enum',
    enum: PharmacyDispatchStatus,
    default: PharmacyDispatchStatus.Received,
  })
  status!: PharmacyDispatchStatus;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  receivedAt?: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  acceptedAt?: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  preparedAt?: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  dispensedAt?: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
