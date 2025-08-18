import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Prescription } from './prescription.entity';

@ObjectType()
@Entity({ name: 'prescription_items' })
@Index(['prescription'])
export class PrescriptionItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => Prescription)
  @ManyToOne(() => Prescription, (p) => p.items, { onDelete: 'CASCADE' })
  prescription!: Prescription;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 64, nullable: true })
  code?: string | null; // cisCode|atc

  @Field(() => String)
  @Column({ type: 'varchar', length: 256 })
  denomination!: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 128 })
  dosage!: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 128 })
  forme!: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 256 })
  posologie!: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  dureeJours!: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  renouvellement!: number;
}
