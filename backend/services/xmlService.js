const txtService = require('./txtService');

function toTxt(xml, delim = ';', keyHex) {
  return txtService.fromXml(xml, delim, keyHex);
}

module.exports = { toTxt };
