const { randomBytes, createCipheriv, createDecipheriv } = require('crypto');
const ALGO = 'aes-256-gcm', IV_LEN = 12;

function encrypt(text, keyHex) {
  if (keyHex.length !== 64) throw Error('Key must be 32-byte hex');
  const key = Buffer.from(keyHex, 'hex');
  const iv  = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${enc.toString('hex')}`;
}

function decrypt(payload, keyHex) {
  const [ivH, tagH, dataH] = payload.split(':');
  const key = Buffer.from(keyHex, 'hex');
  const iv  = Buffer.from(ivH,  'hex');
  const tag = Buffer.from(tagH, 'hex');
  const data= Buffer.from(dataH,'hex');
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(data), decipher.final()]);
  return dec.toString('utf8');
}

module.exports = { encrypt, decrypt };
