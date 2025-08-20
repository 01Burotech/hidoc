import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Role, KycStatus } from './enums';
import { Medecin } from './medecin.entity';
import { Patient } from './patient.entity';
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

registerEnumType(Role, {
  name: 'Role',
});

registerEnumType(KycStatus, {
  name: 'KycStatus',
});

@ObjectType()
@Entity({ name: 'users' })
@Index(['email'], { unique: true })
@Index(['phone'], { unique: true })
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ type: 'varchar', length: 160, unique: true })
  email!: string;

  @Field()
  @Column({ type: 'varchar', length: 32, unique: true })
  phone?: string;

  // tu peux cacher le mot de passe à GraphQL
  @Column({ nullable: true })
  passwordHash!: string;

  @Field(() => Role)
  @Column({ type: 'enum', enum: Role })
  role!: Role;

  @Field(() => KycStatus)
  @Column({ type: 'enum', enum: KycStatus, default: KycStatus.Pending })
  kycStatus!: KycStatus;

  @Field()
  @Column({ type: 'bool', default: false })
  twoFAEnabled!: boolean;

  @Field()
  @Column({ type: 'bool', default: false })
  isOtpOnly!: boolean;

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;

  @Field(() => Medecin, { nullable: true })
  @OneToOne(() => Medecin, (m) => m.user)
  medecin?: Medecin;

  @Field(() => Patient, { nullable: true })
  @OneToOne(() => Patient, (p) => p.user)
  patient?: Patient;
}
