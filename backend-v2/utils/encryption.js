const { randomBytes, createCipheriv, createDecipheriv } = require('crypto');

const ALGO   = 'aes-256-gcm';
const IV_LEN = 12; // GCM estándar (96 bits)

/** Valida que la clave sea un hex de 32 bytes (64 caracteres). */
function assertKey(keyHex) {
  if (!keyHex || keyHex.length !== 64 || !/^[0-9a-f]+$/i.test(keyHex)) {
    throw new Error('Key must be a 32-byte hex string (64 hex chars).');
  }
}

/** @param {string} plain  texto en claro
 *  @param {string} keyHex clave AES-256 en hex
 *  @returns {string} iv:tag:cipher (todos en hex) */
function encrypt(plain, keyHex) {
  assertKey(keyHex);
  const key    = Buffer.from(keyHex, 'hex');
  const iv     = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);

  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${tag.toString('hex')}:${enc.toString('hex')}`;
}

/** @param {string} payload iv:tag:cipher (hex)
 *  @param {string} keyHex  misma clave usada al cifrar */
function decrypt(payload, keyHex) {
  assertKey(keyHex);
  const [ivH, tagH, dataH] = payload.split(':');
  const key  = Buffer.from(keyHex, 'hex');
  const iv   = Buffer.from(ivH,  'hex');
  const tag  = Buffer.from(tagH, 'hex');
  const data = Buffer.from(dataH,'hex');

  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);

  const dec = Buffer.concat([decipher.update(data), decipher.final()]);
  return dec.toString('utf8');
}

module.exports = { encrypt, decrypt, assertKey };
