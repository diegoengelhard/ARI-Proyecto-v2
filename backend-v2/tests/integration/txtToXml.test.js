const request = require('supertest');
const app = require('../../app');

const key = '111122223333444455556666777788889999aaaabbbbccccddddeeeeffff0000';

const txt = 'a;b;c;4111111111111111;G;222;POLYGON ((1 2,3 4))';

describe('POST /api/conversion/txt-to-xml', () => {
  it('200 → XML contiene <clientes>', async () => {
    const res = await request(app)
      .post('/api/conversion/txt-to-xml')
      .send({ content: txt, delimiter: ';', key });
    expect(res.statusCode).toBe(200);
    expect(res.body.xml).toMatch(/<clientes>/);
  });

  it('400 → falta content', async () => {
    const res = await request(app)
      .post('/api/conversion/txt-to-xml')
      .send({ delimiter: ';', key });
    expect(res.statusCode).toBe(400);
  });

  it('400 - TXT enviado al endpoint xml-to-txt', async () => {
    const res = await request(app)
      .post('/api/conversion/xml-to-txt')
      .send({ xml: 'linea;txt;equivocada', delimiter: ';', key });
    expect(res.statusCode).toBe(400);
  });
});