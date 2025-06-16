const { encrypt, decrypt, assertKey } = require('../utils/encryption');
const { wktToGeoJSON, geoJSONToWkt, wktPointToGeoJSON, geoJSONPointToWkt } = require('../utils/geoService'); // Updated import
const xmlH  = require('../utils/xmlService');
const jsonH = require('../utils/jsonService');

const controller = {};

const DELIM_DEF = ';';

/**
 Convierte una línea de texto a un objeto cliente
  @param {string} line - línea de texto con campos separados por delimitador
  @param {string} delim - delimitador para dividir los campos
  @param {string} keyHex - clave AES-256 en formato hexadecimal para cifrar la tarjeta
  @returns {Object} objeto cliente con campos: documento, nombres, apellidos, tarjeta, tipo, telefono, poligono, ubicacion
*/
function lineToObj(line, delim, keyHex) {
  const fields = line.split(delim).map(s => s.trim()); // Divide la línea por el delimitador y elimina espacios
  const [doc, nom, ape, card, tipo, tel] = fields; // Extrae los campos: documento, nombres, apellidos, tarjeta, tipo, teléfono
  const polyRaw = fields[6] || '';
  const pointRaw = fields[7];

  // Construye el objeto cliente
  const clienteObj = {
    documento: doc,
    nombres:   nom,
    apellidos: ape,
    tarjeta:   encrypt(card, keyHex), // Cifra la tarjeta con la clave proporcionada
    tipo,
    telefono:  tel,
    poligono:  wktToGeoJSON(polyRaw) // Convierte el WKT de polígono a GeoJSON
  };

  // Revisa si existe el campo de ubicación
  if (pointRaw !== undefined) {
    // Convertir el WKT de punto a GeoJSON
    clienteObj.ubicacion = wktPointToGeoJSON(pointRaw);
  }

  return clienteObj; // Devuelve el objeto cliente con los campos procesados
}

/** 
 Convierte el objeto cliente a TXT 
  @param {Object} o - objeto cliente con campos: documento, nombres, apellidos, tarjeta, tipo, telefono, poligono, ubicacion
  @param {string} delim - delimitador para unir los campos
  @param {string} keyHex - clave AES-256 en formato hexadecimal para descifrar la tarjeta
  @returns {string} línea de texto con los campos del objeto cliente unidos por el delimitador
*/
function objToLine(o, delim, keyHex) {
  // Reconstruye el TXT a partir de los campos del objeto cliente
  const parts = [
    o.documento,
    o.nombres,
    o.apellidos,
    decrypt(o.tarjeta, keyHex), // Descifra la tarjeta con la clave proporcionada
    o.tipo,
    o.telefono,
    geoJSONToWkt(o.poligono) // Convierte el polígono GeoJSON a WKT
  ];

  // Si existe el campo de ubicación, convertirlo a WKT
  if (o.ubicacion) {
    // Valida que o.ubicacion sea un objeto GeoJSON Point valido
    const pointWkt = geoJSONPointToWkt(o.ubicacion);
    if (pointWkt) {
      parts.push(pointWkt);
    }
  }

  return parts.join(delim); // Retorna TXT uniendo los campos con el delimitador
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

    const forXml = clientes.map(cli => ({
      ...cli,
      poligono: jsonH.stringify(cli.poligono, true),
      ubicacion: jsonH.stringify(cli.ubicacion, true)
    }));

    // construir XML
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
      .map(l => lineToObj(l, delimiter, key)); // lineToObj maneja punto ubicacion

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
    const rawClientes = [].concat(parsed.clientes?.cliente || []); // Obtiene los datos del XML, asegurando que sea un array

    // si poligono o ubicacion es string JSON, parsearlo
    const arr = rawClientes.map(o => {
      const clienteObj = { ...o };
      if (typeof clienteObj.poligono === 'string') {
        try { clienteObj.poligono = jsonH.parse(clienteObj.poligono); }
        catch (_) { /* dejar tal cual */ }
      }
      if (typeof clienteObj.ubicacion === 'string') {
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
    const txt = arr.map(o => objToLine(o, delimiter, key)).join('\n');
    return res.json({ txt });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = controller;
