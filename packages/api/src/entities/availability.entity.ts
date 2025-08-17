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

@Entity({ name: 'availabilities' })
@Index(['medecin', 'start', 'end'])
@Check(`"capacity" >= 1`)
export class Availability {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Medecin, (m) => m.availabilities, { onDelete: 'CASCADE' })
  medecin!: Medecin;

  @Column({ type: 'timestamptz' })
  start!: Date;

  @Column({ type: 'timestamptz' })
  end!: Date;

  @Column({ type: 'enum', enum: AvailabilityType })
  type!: AvailabilityType;

  @Column({ type: 'int', default: 1 })
  capacity!: number;

  @OneToMany(() => Appointment, (a) => a.availability)
  appointments!: Appointment[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
