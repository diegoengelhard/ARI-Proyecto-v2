const { randomBytes, createCipheriv, createDecipheriv } = require('crypto');

/**
 * Módulo de cifrado AES-256-GCM
 * Proporciona funciones para cifrar y descifrar texto usando AES-256-GCM.
 * @var ALGO - Algoritmo de cifrado AES-256-GCM
 * @var IV_LEN - Longitud del IV (vector de inicialización) = 12 bytes ≡ GCM estándar (96 bits)
 * garaniza: 1) Unicidad de cada cifrado 2) Aleatoriedad inicial
 */
const ALGO   = 'aes-256-gcm';
const IV_LEN = 12;

/** Valida que la clave sea un hex de 32 bytes → 256 bits (64 caracteres). */
function assertKey(keyHex) {
  if (!keyHex || keyHex.length !== 64 || !/^[0-9a-f]+$/i.test(keyHex)) {
    throw new Error('Key must be a 32-byte hex string (64 hex chars).');
  }
}

/** 
 * Cifra un texto plano usando AES-256-GCM.
 *  @param {string} plain  texto en claro
 *  @param {string} keyHex clave AES-256 en hex
 *  @returns {string} iv:tag:cipher (todos en hex) 
*/
function encrypt(plain, keyHex) {
  assertKey(keyHex); // Verifica que la clave sea válida

  const key    = Buffer.from(keyHex, 'hex'); // Convierte la clave de hex a Buffer
  const iv     = randomBytes(IV_LEN); // Genera un IV aleatorio de 12 bytes
  const cipher = createCipheriv(ALGO, key, iv); // Crea el cifrador AES-256-GCM con la clave y el IV

  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]); // Cifra el texto plano y concatena los resultados
  /*
    TAG
    * garantiza que quien descifra usa la misma clave con la que se cifró.
    * si el tag no coincide, el descifrado fallará.
  */
  const tag = cipher.getAuthTag(); // Obtiene la etiqueta de autenticación del cifrador

  return `${iv.toString('hex')}:${tag.toString('hex')}:${enc.toString('hex')}`; // Retorna el payload
}

/**
 * Descifra un payload cifrado con AES-256-GCM.
 * @param {string} payload payload cifrado en formato iv:tag:cipher
 * @param {string} keyHex clave AES-256 en hex
 * @returns {string} texto descifrado
*/
function decrypt(payload, keyHex) {
  assertKey(keyHex); // Verifica que la clave sea válida

  const [ivH, tagH, dataH] = payload.split(':'); // Divide el payload en IV, tag y datos cifrados

  // Se reconstruyen los buffers a partir de los hexadecimales
  const key  = Buffer.from(keyHex, 'hex');
  const iv   = Buffer.from(ivH,  'hex');
  const tag  = Buffer.from(tagH, 'hex');
  const data = Buffer.from(dataH,'hex');

  const decipher = createDecipheriv(ALGO, key, iv); // Crea el descifrador AES-256-GCM con la clave y el IV
  decipher.setAuthTag(tag); // Obtiene el tag original de autenticación del descifrador

  const dec = Buffer.concat([decipher.update(data), decipher.final()]); // Descifra los datos cifrados y concatena los resultados
  return dec.toString('utf8'); // Retorna el texto descifrado
}

module.exports = { encrypt, decrypt, assertKey };
