import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Medecin } from './medecin.entity';
import { SignatureType } from './enums';
import { Prescription } from './prescription.entity';

registerEnumType(SignatureType, { name: 'SignatureType' });
@ObjectType()
@Entity({ name: 'doctor_signatures' })
export class DoctorSignature {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => Medecin)
  @ManyToOne(() => Medecin, (d) => d.signatures, {
    onDelete: 'CASCADE',
    eager: true,
  })
  doctor!: Medecin;

  @Field(() => SignatureType)
  @Column({ type: 'enum', enum: SignatureType })
  signatureType!: SignatureType;

  @Field(() => Date)
  @Column({ type: 'timestamptz' })
  signedAt!: Date;

  @Field()
  @Column({ type: 'text' })
  signatureBlob!: string; // DER/BASE64

  @Field()
  @Column({ type: 'text' })
  certificateChain!: string;

  @Field()
  @Column({ type: 'text' })
  tsaToken!: string;

  @Field(() => [Prescription])
  @OneToMany(() => Prescription, (p) => p.doctorSignature)
  prescriptions!: Prescription[];
}
