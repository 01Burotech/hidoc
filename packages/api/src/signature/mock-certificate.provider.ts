import { Injectable } from '@nestjs/common';
import { ICertificateProvider } from './interfaces/certificate-provider.interface';
import * as crypto from 'crypto';

@Injectable()
export class MockCertificateProvider implements ICertificateProvider {
  privateKey = crypto.generateKeyPairSync('ec', { namedCurve: 'P-256' })
    .privateKey;
  certificateChain = ['mock-cert'];

  async getCertificateForDoctor(_doctorId: string) {
    return {
      privateKey: this.privateKey.export({ type: 'pkcs8', format: 'der' }),
      certificateChain: this.certificateChain,
    };
  }

  async signHashP256(hash: Buffer, _doctorId: string) {
    const sign = crypto.createSign('SHA256');
    sign.update(hash);
    sign.end();
    const signature = sign.sign(this.privateKey);
    const tsaToken = `mock-tsa-${Date.now()}`;
    return { signature, tsaToken };
  }
}
