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
import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { Prescription } from './prescription.entity';
import { Pharmacie } from './pharmacie.entity';
import { PharmacyDispatchStatus } from './enums';

@ObjectType()
@Entity({ name: 'pharmacy_dispatches' })
@Index(['pharmacie', 'prescription'], { unique: true })
export class PharmacyDispatch {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => Prescription)
  @ManyToOne(() => Prescription, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'prescription_id' })
  prescription!: Prescription;

  @Field(() => Pharmacie)
  @ManyToOne(() => Pharmacie, (p) => p.dispatches, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'pharmacie_id' })
  pharmacie!: Pharmacie;

  @Field(() => PharmacyDispatchStatus)
  @Column({
    type: 'enum',
    enum: PharmacyDispatchStatus,
    default: PharmacyDispatchStatus.Received,
  })
  status!: PharmacyDispatchStatus;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  rejectionReason?: string | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  receivedAt?: Date | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  acceptedAt?: Date | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  preparedAt?: Date | null;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  dispensedAt?: Date | null;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
