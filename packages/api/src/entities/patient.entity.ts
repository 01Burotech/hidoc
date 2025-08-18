import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@ObjectType()
@Entity({ name: 'patients' })
@Index(['user'], { unique: true })
export class Patient {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => User)
  @OneToOne(() => User, (u) => u.patient, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'date', nullable: true })
  dateNaissance?: string | null;

  @Field(() => [String])
  @Column({ type: 'text', array: true, default: '{}' })
  assurances!: string[];

  @Field(() => String) // ⚠️ exposé comme String (JSON.stringify en resolver)
  @Column({ type: 'jsonb', default: {} })
  dossiers!: Record<string, unknown>;

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
