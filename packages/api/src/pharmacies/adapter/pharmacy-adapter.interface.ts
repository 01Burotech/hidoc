import { Prescription } from '../../entities/prescription.entity';

export interface IPharmacyAdapter {
  sendPrescription(
    prescription: Prescription,
    pharmacyEndpoint: string,
    jwtToken: string,
  ): Promise<boolean>;
}
