import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
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

@ObjectType()
@Entity({ name: 'medecins' })
@Index(['rpps'], { unique: true })
export class Medecin {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => User)
  @OneToOne(() => User, (u) => u.medecin, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Field(() => [String])
  @Column({ type: 'text', array: true, default: '{}' })
  specialites!: string[];

  @Field(() => [String])
  @Column({ type: 'text', array: true, default: '{}' })
  lieux!: string[];

  @Field()
  @Column({ type: 'varchar', length: 64 })
  rpps!: string;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  tarifs!: number;

  @Field(() => Int)
  @Column({ type: 'int', default: 0 })
  weekendPremium!: number;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;

  @Field(() => [Availability], { nullable: true })
  @OneToMany(() => Availability, (a) => a.medecin)
  availabilities!: Availability[];

  @Field(() => [Appointment], { nullable: true })
  @OneToMany(() => Appointment, (a) => a.medecin)
  appointments!: Appointment[];

  @Field(() => [DoctorSignature], { nullable: true })
  @OneToMany(() => DoctorSignature, (s) => s.doctor)
  signatures!: DoctorSignature[];
}
