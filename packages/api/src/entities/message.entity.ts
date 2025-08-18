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
@Entity({ name: 'messages' })
@Index(['threadId'])
export class Message {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => ID)
  @Column({ type: 'uuid' })
  threadId!: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true, eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender?: User | null;

  @Field()
  @Column({ type: 'text' })
  body!: string;

  @Field(() => [String])
  @Column({ type: 'text', array: true, default: '{}' })
  attachments!: string[];

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
