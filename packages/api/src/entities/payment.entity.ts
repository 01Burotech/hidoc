import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { Medecin } from './medecin.entity';
import { PaymentStatus } from './enums';
import { Appointment } from './appointment.entity';

@Entity({ name: 'payments' })
@Index(['patient'])
@Index(['doctor'])
@Index(['status'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Patient, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'patient_id' })
  patient?: Patient | null;

  @ManyToOne(() => Medecin, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'doctor_id' })
  doctor?: Medecin | null;

  @OneToOne(() => Appointment, (a) => a.payment, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'appointment_id' })
  appointment?: Appointment | null;

  @Column({ type: 'int' })
  amount!: number; // cents

  @Column({ type: 'varchar', length: 16, default: 'XOF' })
  currency!: string;

  @Column({ type: 'varchar', length: 32, default: 'stripe' })
  provider!: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.RequiresPaymentMethod,
  })
  status!: PaymentStatus;

  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, unknown>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
