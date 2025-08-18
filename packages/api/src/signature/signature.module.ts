import { Module } from '@nestjs/common';
import { MockCertificateProvider } from './mock-certificate.provider';

@Module({
  providers: [
    { provide: 'ICertificateProvider', useClass: MockCertificateProvider },
  ],
  exports: ['ICertificateProvider'],
})
export class SignatureModule {}
