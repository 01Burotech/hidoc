export enum Role {
  Patient = 'patient',
  Medecin = 'medecin',
  Pharmacie = 'pharmacie',
  Admin = 'admin',
}

export enum KycStatus {
  Pending = 'pending',
  Verified = 'verified',
  Rejected = 'rejected',
}

export enum AvailabilityType {
  Weekend = 'weekend',
  Weekday = 'weekday',
}

export enum AppointmentStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Completed = 'completed',
  Cancelled = 'cancelled',
  NoShow = 'no-show',
}

export enum Mode {
  Presentiel = 'présentiel',
  Visio = 'visio',
}

export enum PrescriptionStatus {
  Draft = 'draft',
  Signed = 'signed',
  Revoked = 'revoked',
}

export enum PharmacyDispatchStatus {
  Received = 'received',
  Accepted = 'accepted',
  Prepared = 'prepared',
  Dispensed = 'dispensed',
  Rejected = 'rejected',
}

export enum PaymentStatus {
  RequiresPaymentMethod = 'requires_payment_method',
  RequiresConfirmation = 'requires_confirmation',
  Processing = 'processing',
  Succeeded = 'succeeded',
  Canceled = 'canceled',
  Refunded = 'refunded',
}

export enum SignatureType {
  QES = 'QES', // Qualified Electronic Signature
  AES = 'AES', // Advanced Electronic Signature
}
