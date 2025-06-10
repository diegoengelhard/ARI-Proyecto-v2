const request = require('supertest');
const app     = require('../../app');
const { encrypt } = require('../../utils/encryption');

const key = '111122223333444455556666777788889999aaaabbbbccccddddeeeeffff0000';

// ciframos una tarjeta de prueba con la misma clave
const cipherCard = encrypt('4111111111111111', key);

const goodXml =
  `<clientes><cliente>
     <documento>1</documento><nombres>A</nombres><apellidos>B</apellidos>
     <tarjeta>${cipherCard}</tarjeta>
     <tipo>GOLD</tipo><telefono>555</telefono>
     <poligono>{"type":"Polygon","coordinates":[[[1,2],[3,4]]]}</poligono>
  </cliente></clientes>`;

const badXml = '<clientes><cliente>';   // deliberadamente mal formado

describe('POST /api/conversion/xml-to-txt', () => {

  it('200 → devuelve campo txt', async () => {
    const res = await request(app)
      .post('/api/conversion/xml-to-txt')
      .send({ xml: goodXml, delimiter: ';', key });

    expect(res.statusCode).toBe(200);
    // se espera una línea TXT (contiene al menos 5 delimitadores ;)
    expect((res.body.txt || '').split(';').length).toBeGreaterThanOrEqual(6);
  });

  it('400 → XML mal formado', async () => {
    const res = await request(app)
      .post('/api/conversion/xml-to-txt')
      .send({ xml: badXml, delimiter: ';', key });

    expect(res.statusCode).toBe(400);
  });
});
