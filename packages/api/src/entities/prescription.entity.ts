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
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

import { Appointment } from './appointment.entity';
import { DoctorSignature } from './doctor-signature.entity';
import { PrescriptionItem } from './prescription-item.entity';
import { PrescriptionStatus } from './enums';

registerEnumType(PrescriptionStatus, { name: 'PrescriptionStatus' });

@ObjectType()
@Entity({ name: 'prescriptions' })
@Index(['status'])
export class Prescription {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => Appointment)
  @OneToOne(() => Appointment, (a) => a.prescription, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'appointment_id' })
  appointment!: Appointment;

  @Field(() => DoctorSignature, { nullable: true })
  @ManyToOne(() => DoctorSignature, (s) => s.prescriptions, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'doctor_signature_id' })
  doctorSignature?: DoctorSignature | null;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 1024, nullable: true })
  pdfUrl?: string | null;

  @Field()
  @Column({ type: 'varchar', length: 128 })
  hash!: string;

  @Field(() => PrescriptionStatus)
  @Column({
    type: 'enum',
    enum: PrescriptionStatus,
    default: PrescriptionStatus.Draft,
  })
  status!: PrescriptionStatus;

  @Field(() => [String])
  @Column({ type: 'uuid', array: true, default: '{}', nullable: false })
  sentToPharmacies!: string[];

  @Field(() => [PrescriptionItem])
  @OneToMany(() => PrescriptionItem, (i) => i.prescription, { cascade: true })
  items!: PrescriptionItem[];

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
