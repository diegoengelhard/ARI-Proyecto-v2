function stringify(obj, pretty = true) { return JSON.stringify(obj, null, pretty ? 2 : 0); }
function parse(str)                     { return JSON.parse(str); }

module.exports = { stringify, parse };
