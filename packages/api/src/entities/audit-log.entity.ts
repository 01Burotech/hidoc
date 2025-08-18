import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ObjectType, Field, ID, GraphQLISODateTime } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
@Entity({ name: 'audit_logs' })
@Index(['entityType', 'entityId'])
export class AuditLog {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true, eager: true })
  @JoinColumn({ name: 'actor_id' })
  actor?: User | null;

  @Field()
  @Column({ type: 'varchar', length: 128 })
  action!: string;

  @Field()
  @Column({ type: 'varchar', length: 64 })
  entityType!: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  entityId!: string;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({ type: 'timestamptz' })
  timestamp!: Date;

  @Field(() => String) // GraphQL n’a pas de type JSON natif, on peut exposer en string ou créer un scalar JSON
  @Column({ type: 'jsonb', default: {} })
  details!: Record<string, unknown>;
}
