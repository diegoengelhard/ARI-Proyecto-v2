const { encrypt, decrypt } = require('../../utils/encryption');

const key = '111122223333444455556666777788889999aaaabbbbccccddddeeeeffff0000';

describe('AES-256-GCM encrypt/decrypt', () => {
  it('debe cifrar y descifrar correctamente', () => {
    const texto = '4111111111111111';
    const cipher = encrypt(texto, key);
    const plain  = decrypt(cipher, key);
    expect(plain).toBe(texto);
  });
});