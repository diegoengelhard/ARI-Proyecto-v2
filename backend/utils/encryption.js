const { randomBytes, createCipheriv, createDecipheriv } = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;                      // GCM estándar

function encrypt(text, key) {
  const iv    = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, Buffer.from(key, 'hex'), iv);

  const enc  = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag  = cipher.getAuthTag();

  return `${iv.toString('hex')}:${tag.toString('hex')}:${enc.toString('hex')}`;
}

function decrypt(payload, key) {
  const [ivHex, tagHex, dataHex] = payload.split(':');
  const iv   = Buffer.from(ivHex,  'hex');
  const tag  = Buffer.from(tagHex, 'hex');
  const data = Buffer.from(dataHex,'hex');

  const decipher = createDecipheriv(ALGORITHM, Buffer.from(key, 'hex'), iv);
  decipher.setAuthTag(tag);

  const dec = Buffer.concat([decipher.update(data), decipher.final()]);
  return dec.toString('utf8');
}

module.exports = {
  encrypt,
  decrypt
};
