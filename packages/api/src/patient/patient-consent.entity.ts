import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Patient } from '../entities/patient.entity';

@Entity({ name: 'patient_consent' })
export class PatientConsent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @Column()
  patientId!: string;

  @Column()
  scope!: string;

  @Column({ default: true })
  granted!: boolean;

  @CreateDateColumn()
  timestamp!: Date;
}
