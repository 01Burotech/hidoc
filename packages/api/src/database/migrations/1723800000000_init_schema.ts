import { MigrationInterface, QueryRunner } from 'typeorm';

export class initSchema1723800000000 implements MigrationInterface {
  name = 'initSchema1723800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "role_enum" AS ENUM ('patient','medecin','pharmacie','admin')`,
    );
    await queryRunner.query(
      `CREATE TYPE "kyc_status_enum" AS ENUM ('pending','verified','rejected')`,
    );
    await queryRunner.query(`CREATE TABLE "users" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "email" varchar(160) UNIQUE NOT NULL,
      "phone" varchar(32) UNIQUE NOT NULL,
      "role" "role_enum" NOT NULL,
      "kycStatus" "kyc_status_enum" NOT NULL DEFAULT 'pending',
      "twoFAEnabled" boolean NOT NULL DEFAULT false,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      "deletedAt" timestamptz
    )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_users_email" ON "users" ("email")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_phone" ON "users" ("phone")`,
    );

    await queryRunner.query(`CREATE TABLE "patients" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" uuid UNIQUE NOT NULL,
      "dateNaissance" date,
      "assurances" text[] NOT NULL DEFAULT '{}',
      "dossiers" jsonb NOT NULL DEFAULT '{}',
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      "deletedAt" timestamptz,
      CONSTRAINT "FK_patients_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    )`);

    await queryRunner.query(`CREATE TABLE "medecins" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" uuid UNIQUE NOT NULL,
      "specialites" text[] NOT NULL DEFAULT '{}',
      "lieux" text[] NOT NULL DEFAULT '{}',
      "rpps" varchar(64) NOT NULL,
      "tarifs" int NOT NULL DEFAULT 0,
      "weekendPremium" int NOT NULL DEFAULT 0,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      "deletedAt" timestamptz,
      CONSTRAINT "UQ_medecins_rpps" UNIQUE ("rpps"),
      CONSTRAINT "FK_medecins_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    )`);

    await queryRunner.query(
      `CREATE TYPE "availability_type_enum" AS ENUM ('weekend','weekday')`,
    );
    await queryRunner.query(`CREATE TABLE "availabilities" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "medecinId" uuid NOT NULL,
      "start" timestamptz NOT NULL,
      "end" timestamptz NOT NULL,
      "type" "availability_type_enum" NOT NULL,
      "capacity" int NOT NULL DEFAULT 1,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      "deletedAt" timestamptz,
      CONSTRAINT "CHK_capacity_positive" CHECK (capacity >= 1),
      CONSTRAINT "FK_avail_medecin" FOREIGN KEY ("medecinId") REFERENCES "medecins"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_avail_medecin_start_end" ON "availabilities" ("medecinId","start","end")`,
    );

    await queryRunner.query(`CREATE TABLE "pharmacies" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "nom" varchar(200) NOT NULL,
      "adresse" text NOT NULL,
      "gln" varchar(64) NOT NULL,
      "apiEndpoint" varchar(512) NOT NULL,
      "publicKey" text NOT NULL,
      "lat" numeric(9,6) NOT NULL,
      "lng" numeric(9,6) NOT NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      "deletedAt" timestamptz,
      CONSTRAINT "UQ_pharmacies_gln" UNIQUE ("gln")
    )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_pharmacies_lat_lng" ON "pharmacies" ("lat","lng")`,
    );

    await queryRunner.query(
      `CREATE TYPE "appointment_status_enum" AS ENUM ('pending','confirmed','completed','cancelled','no-show')`,
    );
    await queryRunner.query(
      `CREATE TYPE "mode_enum" AS ENUM ('présentiel','visio')`,
    );
    await queryRunner.query(`CREATE TABLE "appointments" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "patient_id" uuid NOT NULL,
      "medecin_id" uuid NOT NULL,
      "availability_id" uuid,
      "start" timestamptz NOT NULL,
      "end" timestamptz NOT NULL,
      "status" "appointment_status_enum" NOT NULL DEFAULT 'pending',
      "mode" "mode_enum" NOT NULL,
      "payment_id" uuid,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      "deletedAt" timestamptz,
      CONSTRAINT "FK_appt_patient" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_appt_medecin" FOREIGN KEY ("medecin_id") REFERENCES "medecins"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_appt_availability" FOREIGN KEY ("availability_id") REFERENCES "availabilities"("id") ON DELETE SET NULL
    )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_appt_medecin_start_end" ON "appointments" ("medecin_id","start","end")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_appt_patient_start_end" ON "appointments" ("patient_id","start","end")`,
    );

    await queryRunner.query(
      `CREATE TYPE "payment_status_enum" AS ENUM ('requires_payment_method','requires_confirmation','processing','succeeded','canceled','refunded')`,
    );
    await queryRunner.query(`CREATE TABLE "payments" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "patient_id" uuid,
      "doctor_id" uuid,
      "appointment_id" uuid,
      "amount" int NOT NULL,
      "currency" varchar(16) NOT NULL DEFAULT 'XOF',
      "provider" varchar(32) NOT NULL DEFAULT 'stripe',
      "status" "payment_status_enum" NOT NULL DEFAULT 'requires_payment_method',
      "metadata" jsonb NOT NULL DEFAULT '{}',
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT "FK_pay_patient" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE SET NULL,
      CONSTRAINT "FK_pay_doctor" FOREIGN KEY ("doctor_id") REFERENCES "medecins"("id") ON DELETE SET NULL,
      CONSTRAINT "FK_pay_appt" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL
    )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_pay_patient" ON "payments" ("patient_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_pay_doctor" ON "payments" ("doctor_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_pay_status" ON "payments" ("status")`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_appt_payment" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL`,
    );

    await queryRunner.query(
      `CREATE TYPE "signature_type_enum" AS ENUM ('QES','AES')`,
    );
    await queryRunner.query(`CREATE TABLE "doctor_signatures" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "doctorId" uuid NOT NULL,
      "signatureType" "signature_type_enum" NOT NULL,
      "signedAt" timestamptz NOT NULL,
      "signatureBlob" text NOT NULL,
      "certificateChain" text NOT NULL,
      "tsaToken" text NOT NULL,
      CONSTRAINT "FK_sig_doctor" FOREIGN KEY ("doctorId") REFERENCES "medecins"("id") ON DELETE CASCADE
    )`);

    await queryRunner.query(
      `CREATE TYPE "prescription_status_enum" AS ENUM ('draft','signed','revoked')`,
    );
    await queryRunner.query(`CREATE TABLE "prescriptions" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "appointment_id" uuid NOT NULL,
      "doctor_signature_id" uuid,
      "jsonPayload" jsonb NOT NULL,
      "pdfUrl" varchar(1024),
      "hash" varchar(128) NOT NULL,
      "status" "prescription_status_enum" NOT NULL DEFAULT 'draft',
      "sentToPharmacies" uuid[] NOT NULL DEFAULT '{}',
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      "deletedAt" timestamptz,
      CONSTRAINT "FK_presc_appt" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_presc_sig" FOREIGN KEY ("doctor_signature_id") REFERENCES "doctor_signatures"("id") ON DELETE SET NULL
    )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_presc_status" ON "prescriptions" ("status")`,
    );

    await queryRunner.query(`CREATE TABLE "prescription_items" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "prescriptionId" uuid NOT NULL,
      "code" varchar(64),
      "denomination" varchar(256) NOT NULL,
      "dosage" varchar(128) NOT NULL,
      "forme" varchar(128) NOT NULL,
      "posologie" varchar(256) NOT NULL,
      "dureeJours" int NOT NULL,
      "renouvellement" int NOT NULL DEFAULT 0,
      CONSTRAINT "FK_item_presc" FOREIGN KEY ("prescriptionId") REFERENCES "prescriptions"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_item_presc" ON "prescription_items" ("prescriptionId")`,
    );

    await queryRunner.query(
      `CREATE TYPE "dispatch_status_enum" AS ENUM ('received','accepted','prepared','dispensed','rejected')`,
    );
    await queryRunner.query(`CREATE TABLE "pharmacy_dispatches" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "prescription_id" uuid NOT NULL,
      "pharmacie_id" uuid NOT NULL,
      "status" "dispatch_status_enum" NOT NULL DEFAULT 'received',
      "rejectionReason" text,
      "receivedAt" timestamptz,
      "acceptedAt" timestamptz,
      "preparedAt" timestamptz,
      "dispensedAt" timestamptz,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT "FK_dispatch_presc" FOREIGN KEY ("prescription_id") REFERENCES "prescriptions"("id") ON DELETE CASCADE,
      CONSTRAINT "FK_dispatch_pharma" FOREIGN KEY ("pharmacie_id") REFERENCES "pharmacies"("id") ON DELETE CASCADE
    )`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_dispatch_pharma_presc" ON "pharmacy_dispatches" ("pharmacie_id","prescription_id")`,
    );

    await queryRunner.query(`CREATE TABLE "messages" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "threadId" uuid NOT NULL,
      "sender_id" uuid,
      "body" text NOT NULL,
      "attachments" text[] NOT NULL DEFAULT '{}',
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT "FK_msg_sender" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE SET NULL
    )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_messages_thread" ON "messages" ("threadId")`,
    );

    await queryRunner.query(`CREATE TABLE "audit_logs" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "actor_id" uuid,
      "action" varchar(128) NOT NULL,
      "entityType" varchar(64) NOT NULL,
      "entityId" uuid NOT NULL,
      "timestamp" timestamptz NOT NULL DEFAULT now(),
      "details" jsonb NOT NULL DEFAULT '{}',
      CONSTRAINT "FK_audit_actor" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL
    )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_audit_entity" ON "audit_logs" ("entityType","entityId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_audit_entity"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_messages_thread"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "messages"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_dispatch_pharma_presc"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "pharmacy_dispatches"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "dispatch_status_enum"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_item_presc"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "prescription_items"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_presc_status"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "prescriptions"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "prescription_status_enum"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "doctor_signatures"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "signature_type_enum"`);

    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT IF EXISTS "FK_appt_payment"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_pay_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_pay_doctor"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_pay_patient"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payments"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payment_status_enum"`);

    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_appt_patient_start_end"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_appt_medecin_start_end"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "appointments"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "mode_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "appointment_status_enum"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_pharmacies_lat_lng"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "pharmacies"`);

    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_avail_medecin_start_end"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "availabilities"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "availability_type_enum"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "medecins"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "patients"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_phone"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_email"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "kyc_status_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "role_enum"`);
  }
}
