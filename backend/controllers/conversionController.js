const txtService  = require('../services/txtService.js');
const xmlService  = require('../services/xmlService.js');
const jsonService = require('../services/jsonService.js');

async function txtToXml(req, res) {
  try {
    const { content, delimiter, key } = req.body; // content = string del .txt
    const xml = await txtService.toXml(content, delimiter, key);
    res.status(200).json({ xml });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function txtToJson(req, res)  {
  try {
    const { content, delimiter, key } = req.body; // content = string del .txt
    const json = await txtService.toJson(content, delimiter, key);
    res.status(200).json({ json });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function xmlToTxt(req, res)   {
  try {
    const { xml } = req.body; // xml = string del .xml
    const txt = await xmlService.toTxt(xml);
    res.status(200).json({ txt });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function jsonToTxt(req, res)  {
  try {
    const { json } = req.body; // json = string del .json
    const txt = await jsonService.toTxt(json);
    res.status(200).json({ txt });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  txtToXml,
  txtToJson,
  xmlToTxt,
  jsonToTxt
};
