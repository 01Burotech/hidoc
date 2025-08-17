import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role, KycStatus } from './enums';
import { Medecin } from './medecin.entity';
import { Patient } from './patient.entity';

@Entity({ name: 'users' })
@Index(['email'], { unique: true })
@Index(['phone'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 160, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  phone!: string;

  @Column({ type: 'enum', enum: Role })
  role!: Role;

  @Column({ type: 'enum', enum: KycStatus, default: KycStatus.Pending })
  kycStatus!: KycStatus;

  @Column({ type: 'bool', default: false })
  twoFAEnabled!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;

  @OneToOne(() => Medecin, (m) => m.user)
  medecin?: Medecin;

  @OneToOne(() => Patient, (p) => p.user)
  patient?: Patient;
}
