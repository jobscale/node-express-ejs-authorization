import crypto from 'crypto';

const alg = 'sha512';

export const createHash = plain => crypto.createHash(alg).update(plain).digest('hex');
