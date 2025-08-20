import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ObjectType,
  Field,
  ID,
  GraphQLISODateTime,
  Float,
} from '@nestjs/graphql';
import { PharmacyDispatch } from './pharmacy-dispatch.entity';

@ObjectType()
@Entity({ name: 'pharmacies' })
@Index(['gln'], { unique: true })
@Index(['lat', 'lng'])
export class Pharmacie {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ type: 'varchar', length: 200 })
  nom!: string;

  @Field()
  @Column({ type: 'text' })
  adresse!: string;

  @Field()
  @Column({ type: 'varchar', length: 64 })
  gln!: string;

  @Field()
  @Column({ type: 'varchar', length: 512 })
  apiEndpoint!: string;

  @Field()
  @Column({ type: 'text' })
  publicKey!: string;

  @Field(() => Float)
  @Column({ type: 'numeric', precision: 9, scale: 6 })
  lat!: number;

  @Field(() => Float)
  @Column({ type: 'numeric', precision: 9, scale: 6 })
  lng!: number;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;

  @Field(() => [PharmacyDispatch])
  @OneToMany(() => PharmacyDispatch, (d) => d.pharmacie)
  dispatches!: PharmacyDispatch[];
}
