const txtService = require('./txtService');

function toTxt(json, delim = ';', keyHex) {
  return txtService.fromJson(json, delim, keyHex);
}

module.exports = { toTxt };
