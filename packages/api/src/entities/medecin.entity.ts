import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Availability } from './availability.entity';
import { Appointment } from './appointment.entity';
import { DoctorSignature } from './doctor-signature.entity';

@Entity({ name: 'medecins' })
@Index(['rpps'], { unique: true })
export class Medecin {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User, (u) => u.medecin, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'text', array: true, default: '{}' })
  specialites!: string[];

  @Column({ type: 'text', array: true, default: '{}' })
  lieux!: string[]; // adresses/cabinets

  @Column({ type: 'varchar', length: 64 })
  rpps!: string;

  @Column({ type: 'int', default: 0 })
  tarifs!: number; // en centimes

  @Column({ type: 'int', default: 0 })
  weekendPremium!: number; // % majoration

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;

  @OneToMany(() => Availability, (a) => a.medecin)
  availabilities!: Availability[];

  @OneToMany(() => Appointment, (a) => a.medecin)
  appointments!: Appointment[];

  @OneToMany(() => DoctorSignature, (s) => s.doctor)
  signatures!: DoctorSignature[];
}
