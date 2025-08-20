import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from '../entities/patient.entity';

@ObjectType() // GraphQL ObjectType
@Entity({ name: 'patient_sensitive' })
export class PatientSensitive {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => Patient)
  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @Field(() => String)
  @Column()
  patientId!: string;

  @Field(() => String) // GraphQL ne supporte pas JSON nativement, on peut exposer en String
  @Column({ type: 'jsonb' })
  data!: Record<string, any>;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt!: Date;
}
