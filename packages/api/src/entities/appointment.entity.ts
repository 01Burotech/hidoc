import { ObjectType, Field, ID } from '@nestjs/graphql';
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
import { registerEnumType } from '@nestjs/graphql';

// Enregistre les enums dans GraphQL
registerEnumType(AppointmentStatus, { name: 'AppointmentStatus' });
registerEnumType(Mode, { name: 'Mode' });

@ObjectType()
@Entity({ name: 'appointments' })
@Index(['medecin', 'start', 'end'])
@Index(['patient', 'start', 'end'])
export class Appointment {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => Patient)
  @ManyToOne(() => Patient, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @Field(() => Medecin)
  @ManyToOne(() => Medecin, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medecin_id' })
  medecin!: Medecin;

  @Field(() => Availability, { nullable: true })
  @ManyToOne(() => Availability, (a) => a.appointments, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'availability_id' })
  availability?: Availability | null;

  @Field()
  @Column({ type: 'timestamptz' })
  start!: Date;

  @Field()
  @Column({ type: 'timestamptz' })
  end!: Date;

  @Field(() => AppointmentStatus)
  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.Pending,
  })
  status!: AppointmentStatus;

  @Field(() => Mode)
  @Column({ type: 'enum', enum: Mode })
  mode!: Mode;

  @Field(() => Payment, { nullable: true })
  @OneToOne(() => Payment, (p) => p.appointment, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'payment_id' })
  payment?: Payment | null;

  @Field(() => Prescription, { nullable: true })
  @OneToOne(() => Prescription, (p) => p.appointment)
  prescription?: Prescription | null;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
