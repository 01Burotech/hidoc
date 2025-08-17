import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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
import { Availability } from './availability.entity';
import { AppointmentStatus, Mode } from './enums';
import { Payment } from './payment.entity';
import { Prescription } from './prescription.entity';

@Entity({ name: 'appointments' })
@Index(['medecin', 'start', 'end'])
@Index(['patient', 'start', 'end'])
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Patient, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @ManyToOne(() => Medecin, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medecin_id' })
  medecin!: Medecin;

  @ManyToOne(() => Availability, (a) => a.appointments, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'availability_id' })
  availability?: Availability | null;

  @Column({ type: 'timestamptz' })
  start!: Date;

  @Column({ type: 'timestamptz' })
  end!: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.Pending,
  })
  status!: AppointmentStatus;

  @Column({ type: 'enum', enum: Mode })
  mode!: Mode;

  @OneToOne(() => Payment, (p) => p.appointment, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'payment_id' })
  payment?: Payment | null;

  @OneToOne(() => Prescription, (p) => p.appointment)
  prescription?: Prescription | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
