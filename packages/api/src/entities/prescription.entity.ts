import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Appointment } from './appointment.entity';
import { DoctorSignature } from './doctor-signature.entity';
import { PrescriptionItem } from './prescription-item.entity';
import { PrescriptionStatus } from './enums';

@Entity({ name: 'prescriptions' })
@Index(['status'])
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Appointment, (a) => a.prescription, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'appointment_id' })
  appointment!: Appointment;

  @ManyToOne(() => DoctorSignature, (s) => s.prescriptions, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'doctor_signature_id' })
  doctorSignature?: DoctorSignature | null;

  @Column({ type: 'jsonb' })
  jsonPayload!: Record<string, unknown>;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  pdfUrl?: string | null;

  @Column({ type: 'varchar', length: 128 })
  hash!: string;

  @Column({
    type: 'enum',
    enum: PrescriptionStatus,
    default: PrescriptionStatus.Draft,
  })
  status!: PrescriptionStatus;

  // Optionnel: trace des pharmacies à qui c'est envoyé (à titre d'audit rapide, le détail est dans PharmacyDispatch)
  @Column({ type: 'uuid', array: true, default: '{}', nullable: false })
  sentToPharmacies!: string[];

  @OneToMany(() => PrescriptionItem, (i) => i.prescription, { cascade: true })
  items!: PrescriptionItem[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
