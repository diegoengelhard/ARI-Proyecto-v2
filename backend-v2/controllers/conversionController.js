const { encrypt, decrypt, assertKey } = require('../utils/encryption');
const { wktToGeoJSON, geoJSONToWkt, wktPointToGeoJSON, geoJSONPointToWkt } = require('../utils/geoService'); // Updated import
const xmlH  = require('../utils/xmlService');
const jsonH = require('../utils/jsonService');

const controller = {};

const DELIM_DEF = ';';

/** Convierte una línea TXT en un objeto cliente */
function lineToObj(line, delim, keyHex) {
  const fields = line.split(delim).map(s => s.trim());
  const [doc, nom, ape, card, tipo, tel] = fields;
  const polyRaw = fields[6] || '';
  const pointRaw = fields[7]; // Will be undefined if only 7 fields

  const clienteObj = {
    documento: doc,
    nombres:   nom,
    apellidos: ape,
    tarjeta:   encrypt(card, keyHex),
    tipo,
    telefono:  tel,
    poligono:  wktToGeoJSON(polyRaw) // Existing: can be object or original string
  };

  if (pointRaw !== undefined) { // If 8th field was present
    clienteObj.ubicacion = wktPointToGeoJSON(pointRaw); // Can be object or original string
  }

  return clienteObj;
}

/** Convierte el objeto cliente en la línea TXT original */
function objToLine(o, delim, keyHex) {
  const parts = [
    o.documento,
    o.nombres,
    o.apellidos,
    decrypt(o.tarjeta, keyHex),
    o.tipo,
    o.telefono,
    geoJSONToWkt(o.poligono)
  ];

  // Add Point WKT if ubicacion exists and is a valid GeoJSON Point producing non-empty WKT
  if (o.ubicacion) {
    const pointWkt = geoJSONPointToWkt(o.ubicacion);
    if (pointWkt) { // geoJSONPointToWkt returns '' for invalid/empty
      parts.push(pointWkt);
    }
  }
  return parts.join(delim);
}

controller.txtToXml = async (req, res) => {
  try {
    const { content, delimiter = DELIM_DEF, key } = req.body;
    assertKey(key);

    const clientes = content
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(l => lineToObj(l, delimiter, key));

    // 2) serializar polígono y ubicacion como JSON string para XML
    const forXml = clientes.map(cli => ({
      ...cli,
      // Stringify, handles if cli.poligono/cli.ubicacion is object, string, or undefined
      poligono: jsonH.stringify(cli.poligono, true),
      ubicacion: jsonH.stringify(cli.ubicacion, true)
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
    assertKey(key);

    // de texto a array de objetos
    const arr = content
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(l => lineToObj(l, delimiter, key)); // lineToObj now handles ubicacion

    // devolvemos el array directamente
    return res.json({ json: arr });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

controller.xmlToTxt = async (req, res) => {
  try {
    const { xml, delimiter = DELIM_DEF, key } = req.body;
    assertKey(key);

    const parsed = xmlH.parse(xml);
    const rawClientes = [].concat(parsed.clientes?.cliente || []); // Robust way to get clients array

    // si poligono o ubicacion es string JSON, parsearlo
    const arr = rawClientes.map(o => {
      const clienteObj = { ...o };
      if (typeof clienteObj.poligono === 'string') {
        try { clienteObj.poligono = jsonH.parse(clienteObj.poligono); }
        catch (_) { /* dejar tal cual */ }
      }
      if (typeof clienteObj.ubicacion === 'string') { // Add this for ubicacion
        try { clienteObj.ubicacion = jsonH.parse(clienteObj.ubicacion); }
        catch (_) { /* dejar tal cual */ }
      }
      return clienteObj;
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
    assertKey(key);

    const arr = Array.isArray(json) ? json : jsonH.parse(json);
    // objToLine now handles ubicacion if present in the JSON objects
    const txt = arr.map(o => objToLine(o, delimiter, key)).join('\n');
    return res.json({ txt });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = controller;
