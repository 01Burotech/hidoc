import * as crypto from 'crypto';

export function hashBuffer(buf: Buffer) {
  return crypto.createHash('sha256').update(buf).digest();
}
