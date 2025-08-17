import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Medecin } from './medecin.entity';
import { SignatureType } from './enums';
import { Prescription } from './prescription.entity';

@Entity({ name: 'doctor_signatures' })
export class DoctorSignature {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Medecin, (d) => d.signatures, {
    onDelete: 'CASCADE',
    eager: true,
  })
  doctor!: Medecin;

  @Column({ type: 'enum', enum: SignatureType })
  signatureType!: SignatureType;

  @Column({ type: 'timestamptz' })
  signedAt!: Date;

  @Column({ type: 'text' })
  signatureBlob!: string; // DER/BASE64

  @Column({ type: 'text' })
  certificateChain!: string;

  @Column({ type: 'text' })
  tsaToken!: string;

  @OneToMany(() => Prescription, (p) => p.doctorSignature)
  prescriptions!: Prescription[];
}
