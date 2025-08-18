export interface ICertificateProvider {
  getCertificateForDoctor(
    doctorId: string,
  ): Promise<{ privateKey: Buffer; certificateChain: string[] }>;
  signHashP256(
    hash: Buffer,
    doctorId: string,
  ): Promise<{ signature: Buffer; tsaToken: string }>;
}
