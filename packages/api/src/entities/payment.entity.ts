import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
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
import { GraphQLJSON } from 'graphql-type-json';

import { Patient } from './patient.entity';
import { Medecin } from './medecin.entity';
import { PaymentStatus } from './enums';
import { Appointment } from './appointment.entity';

registerEnumType(PaymentStatus, { name: 'PaymentStatus' });

@ObjectType()
@Entity({ name: 'payments' })
@Index(['patient'])
@Index(['doctor'])
@Index(['status'])
export class Payment {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => Patient, { nullable: true })
  @ManyToOne(() => Patient, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'patient_id' })
  patient?: Patient | null;

  @Field(() => Medecin, { nullable: true })
  @ManyToOne(() => Medecin, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'doctor_id' })
  doctor?: Medecin | null;

  @Field(() => Appointment, { nullable: true })
  @OneToOne(() => Appointment, (a) => a.payment, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'appointment_id' })
  appointment?: Appointment | null;

  @Field(() => Int)
  @Column({ type: 'int' })
  amount!: number; // en centimes

  @Field()
  @Column({ type: 'varchar', length: 16, default: 'XOF' })
  currency!: string;

  @Field()
  @Column({ type: 'varchar', length: 32, default: 'stripe' })
  provider!: string;

  @Field(() => PaymentStatus)
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.RequiresPaymentMethod,
  })
  status!: PaymentStatus;

  @Field(() => GraphQLJSON)
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, unknown>;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
