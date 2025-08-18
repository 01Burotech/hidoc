import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { Prescription } from '../../entities/prescription.entity';
import { IPharmacyAdapter } from './pharmacy-adapter.interface';

@Injectable()
export class HttpPharmacyAdapter implements IPharmacyAdapter {
  private readonly logger = new Logger(HttpPharmacyAdapter.name);

  async sendPrescription(
    prescription: Prescription,
    pharmacyEndpoint: string,
    jwtToken: string,
  ): Promise<boolean> {
    try {
      const resp = await axios.post(
        `${pharmacyEndpoint}/prescriptions`,
        { prescription },
        { headers: { Authorization: `Bearer ${jwtToken}` } },
      );
      return resp.status >= 200 && resp.status < 300;
    } catch (err) {
      this.logger.error('Failed to send prescription', err);
      return false;
    }
  }
}
