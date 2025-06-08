const { XMLBuilder, XMLParser } = require('fast-xml-parser');
const { encrypt, decrypt }      = require('../utils/encryption');

// Opciones builder / parser
const builderOpts = {
  ignoreAttributes : false,
  format           : true,
  suppressEmptyNode: true,
};

const parserOpts = {
  ignoreAttributes : false,
  parseTagValue    : true,
  trimValues       : true,
};

/**
 * TXT ➜ XML
 * @param {string} txtContent  Contenido completo del .txt
 * @param {string} delimiter   Separador (p. ej. ';' o '|')
 * @param {string} keyHex      Clave AES-256 (64 chars hex)
 * @returns {string}           XML formateado
 */
function toXml(txtContent, delimiter = ';', keyHex) {
  _assertKey(keyHex);

  const clientesArr = txtContent
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(line => _parseLine(line, delimiter, keyHex));

  const root = { clientes: { cliente: clientesArr } };
  const builder = new XMLBuilder(builderOpts);

  return builder.build(root);
}

/**
 * XML ➜ TXT
 * @param {string} xmlContent  XML de entrada
 * @param {string} delimiter   Separador deseado para la salida
 * @param {string} keyHex      Clave AES-256 con la que se cifró
 * @returns {string}           Texto delimitado
 */
function fromXml(xmlContent, delimiter = ';', keyHex) {
  _assertKey(keyHex);

  const parser = new XMLParser(parserOpts);
  const parsed = parser.parse(xmlContent);

  const clientesArr = Array.isArray(parsed?.clientes?.cliente)
    ? parsed.clientes.cliente
    : [parsed.clientes.cliente];

  return clientesArr
    .map(cli => _formatRecord(cli, delimiter, keyHex))
    .join('\n');
}

/* ─────────────────────────  Helpers internos  ────────────────────────── */
function _assertKey(keyHex) {
  if (!keyHex || keyHex.length !== 64) {
    throw new Error('La clave AES debe ser un hex de 32 bytes (64 caracteres)');
  }
}

function _parseLine(line, delimiter, keyHex) {
  const [
    documento,
    nombres,
    apellidos,
    tarjeta,
    tipo,
    telefono,
    poligonoRaw = '',
  ] = line.split(delimiter).map(s => s.trim());

  return {
    documento,
    nombres,
    apellidos,
    tarjeta: encrypt(tarjeta, keyHex),   // ciframos nº de tarjeta
    tipo,
    telefono,
    poligono: poligonoRaw,              // GeoJSON se refinará luego
  };
}

function _formatRecord(cli, delimiter, keyHex) {
  const tarjetaDescifrada = decrypt(cli.tarjeta, keyHex);

  return [
    cli.documento,
    cli.nombres,
    cli.apellidos,
    tarjetaDescifrada,
    cli.tipo,
    cli.telefono,
    cli.poligono || '',
  ].join(delimiter);
}

module.exports = { toXml, fromXml };
