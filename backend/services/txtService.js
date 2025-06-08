const { XMLBuilder, XMLParser } = require('fast-xml-parser');
const { encrypt, decrypt }      = require('../utils/encryption');
const geoService                = require('./geoService');

// opciones comunes
const builderOpts = { ignoreAttributes: false, format: true, suppressEmptyNode: true };
const parserOpts  = { ignoreAttributes: false, parseTagValue: true, trimValues: true };

function toXml(txt, delim = ';', keyHex)      { return _txtTo('xml', txt, delim, keyHex); }
function toJson(txt, delim = ';', keyHex)     { return _txtTo('json', txt, delim, keyHex); }
function fromXml(xml, delim = ';', keyHex)    { return _structuredToTxt('xml', xml, delim, keyHex); }
function fromJson(json, delim = ';', keyHex)  { return _structuredToTxt('json', json, delim, keyHex); }

module.exports = { toXml, toJson, fromXml, fromJson };

/* ──────────── Implementación ──────────── */

function _assertKey(key) {
  if (!key || key.length !== 64) throw new Error('La clave AES debe ser un hex de 32 bytes (64 caracteres)');
}

/* TXT  ➜  XML | JSON */
function _txtTo(target, txt, delim, keyHex) {
  _assertKey(keyHex);

  const clientes = txt
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(line => _parseLine(line, delim, keyHex));

  if (target === 'xml') {
    const builder = new XMLBuilder(builderOpts);
    return builder.build({ clientes: { cliente: clientes } });
  }
  // JSON
  return JSON.stringify(clientes, null, 2);
}

/* XML | JSON  ➜  TXT */
function _structuredToTxt(source, payload, delim, keyHex) {
  _assertKey(keyHex);
  let clientes;

  if (source === 'xml') {
    const parser = new XMLParser(parserOpts);
    const parsed = parser.parse(payload);
    clientes = Array.isArray(parsed?.clientes?.cliente) ? parsed.clientes.cliente
                                                        : [parsed.clientes.cliente];
  } else {
    clientes = Array.isArray(payload) ? payload : JSON.parse(payload);
  }

  return clientes.map(obj => _recordToTxt(obj, delim, keyHex)).join('\n');
}

/* helpers */
function _parseLine(line, delim, keyHex) {
  const [
    documento, nombres, apellidos,
    tarjeta, tipo, telefono,
    poligonoRaw = ''
  ] = line.split(delim).map(s => s.trim());

  return {
    documento,
    nombres,
    apellidos,
    tarjeta : encrypt(tarjeta, keyHex),
    tipo,
    telefono,
    poligono: geoService.wktToGeoJson(poligonoRaw)
  };
}

function _recordToTxt(obj, delim, keyHex) {
  const tarjetaPlano = decrypt(obj.tarjeta, keyHex);
  const poligonoWkt  = geoService.geoJsonToWkt(obj.poligono);

  return [
    obj.documento,
    obj.nombres,
    obj.apellidos,
    tarjetaPlano,
    obj.tipo,
    obj.telefono,
    poligonoWkt
  ].join(delim);
}
