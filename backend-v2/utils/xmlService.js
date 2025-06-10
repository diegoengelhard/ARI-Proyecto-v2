const { XMLBuilder, XMLParser } = require('fast-xml-parser');

const buildOpts = { format: true, suppressEmptyNode: true, ignoreAttributes: false };
const parseOpts = { ignoreAttributes: false, parseTagValue: false, trimValues: true };

function build(obj)  { return new XMLBuilder(buildOpts).build(obj); }
function parse(xml)  { return new XMLParser(parseOpts).parse(xml); }

module.exports = { build, parse };
