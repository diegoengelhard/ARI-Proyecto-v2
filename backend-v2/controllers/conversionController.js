const { encrypt, decrypt, assertKey } = require('../utils/encryption');
const geo   = require('../utils/geoService');
const xmlH  = require('../utils/xmlService');
const jsonH = require('../utils/jsonService');

const controller = {};

const DELIM_DEF = ';';

/** Convierte una línea TXT en un objeto cliente */
function lineToObj(line, delim, keyHex) {
  const [doc, nom, ape, card, tipo, tel, polyRaw = ''] =
    line.split(delim).map(s => s.trim());

  return {
    documento: doc,
    nombres:   nom,
    apellidos: ape,
    tarjeta:   encrypt(card, keyHex),
    tipo,
    telefono:  tel,
    poligono:  geo.wktToGeoJSON(polyRaw)
  };
}

/** Convierte el objeto cliente en la línea TXT original */
function objToLine(o, delim, keyHex) {
  return [
    o.documento,
    o.nombres,
    o.apellidos,
    decrypt(o.tarjeta, keyHex),
    o.tipo,
    o.telefono,
    geo.geoJSONToWkt(o.poligono)
  ].join(delim);
}

controller.txtToXml = async (req, res) => {
  try {
    const { content, delimiter = DELIM_DEF, key } = req.body;
    if (!content || !key) 
      return res.status(400).json({ error: 'content & key required' });
    assertKey(key);

    // 1) de texto a objetos
    const clientes = content
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(l => lineToObj(l, delimiter, key));

    // 2) serializar polígono como JSON string para XML
    const forXml = clientes.map(cli => ({
      ...cli,
      poligono: jsonH.stringify(cli.poligono, true)
    }));

    // 3) construir XML
    const xml = xmlH.build({ clientes: { cliente: forXml } });

    return res.json({ xml });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

controller.txtToJson = async (req, res) => {
  try {
    const { content, delimiter = DELIM_DEF, key } = req.body;
    if (!content || !key) 
      return res.status(400).json({ error: 'content & key required' });
    assertKey(key);

    // de texto a array de objetos
    const arr = content
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(l => lineToObj(l, delimiter, key));

    // devolvemos el array directamente
    return res.json({ json: arr });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

controller.xmlToTxt = async (req, res) => {
  try {
    const { xml, delimiter = DELIM_DEF, key } = req.body;
    if (!xml || !key) 
      return res.status(400).json({ error: 'xml & key required' });
    assertKey(key);

    // parsear XML a JS
    const parsed = xmlH.parse(xml);
    const raw = [].concat(parsed.clientes?.cliente || []);

    // si poligono es string JSON, parsearlo
    const arr = raw.map(o => {
      if (typeof o.poligono === 'string') {
        try { o.poligono = jsonH.parse(o.poligono); }
        catch (_) { /* dejar tal cual */ }
      }
      return o;
    });

    const txt = arr.map(o => objToLine(o, delimiter, key)).join('\n');
    return res.json({ txt });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

controller.jsonToTxt = async (req, res) => {
  try {
    const { json, delimiter = DELIM_DEF, key } = req.body;
    if (!json || !key) 
      return res.status(400).json({ error: 'json & key required' });
    assertKey(key);

    const arr = Array.isArray(json) ? json : jsonH.parse(json);
    const txt = arr.map(o => objToLine(o, delimiter, key)).join('\n');
    return res.json({ txt });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = controller;
