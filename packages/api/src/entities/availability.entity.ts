import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Medecin } from './medecin.entity';
import { Appointment } from './appointment.entity';
import { AvailabilityType } from './enums';
import { registerEnumType } from '@nestjs/graphql';

// 👇 Enregistre l'enum pour GraphQL
registerEnumType(AvailabilityType, { name: 'AvailabilityType' });

@ObjectType()
@Entity({ name: 'availabilities' })
@Index(['medecin', 'start', 'end'])
@Check(`"capacity" >= 1`)
export class Availability {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => Medecin)
  @ManyToOne(() => Medecin, (m) => m.availabilities, { onDelete: 'CASCADE' })
  medecin!: Medecin;

  @Field()
  @Column({ type: 'timestamptz' })
  start!: Date;

  @Field()
  @Column({ type: 'timestamptz' })
  end!: Date;

  @Field(() => AvailabilityType)
  @Column({ type: 'enum', enum: AvailabilityType })
  type!: AvailabilityType;

  @Field(() => Int)
  @Column({ type: 'int', default: 1 })
  capacity!: number;

  @Field(() => [Appointment], { nullable: true })
  @OneToMany(() => Appointment, (a) => a.availability)
  appointments!: Appointment[];

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
