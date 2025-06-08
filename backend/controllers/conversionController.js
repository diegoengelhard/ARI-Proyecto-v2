const txtService  = require('../services/txtService');
const xmlService  = require('../services/xmlService');
const jsonService = require('../services/jsonService');

/* ─ TXT ▸ XML ─ */
async function txtToXml(req, res) {
  try {
    const { content, delimiter = ';', key } = req.body;
    const xml = txtService.toXml(content, delimiter, key);
    return res.status(200).json({ xml });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

/* ─ TXT ▸ JSON ─ */
async function txtToJson(req, res) {
  try {
    const { content, delimiter = ';', key } = req.body;
    const json = txtService.toJson(content, delimiter, key);
    return res.status(200).json({ json });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

/* ─ XML ▸ TXT ─ */
async function xmlToTxt(req, res) {
  try {
    const { xml, delimiter = ';', key } = req.body;
    const txt = xmlService.toTxt(xml, delimiter, key);
    return res.status(200).json({ txt });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

/* ─ JSON ▸ TXT ─ */
async function jsonToTxt(req, res) {
  try {
    const { json, delimiter = ';', key } = req.body;
    const txt = jsonService.toTxt(json, delimiter, key);
    return res.status(200).json({ txt });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { txtToXml, txtToJson, xmlToTxt, jsonToTxt };
