const { XMLValidator } = require('fast-xml-parser'); // Import XMLValidator

const validator = mode => (req, res, next) => {
  const { body } = req;
  const { key, delimiter } = body;

  // clave AES-256-GCM obligatoria
  if (!key || !/^[0-9a-fA-F]{64}$/.test(key)) {
    return res.status(400).json({ error: 'key must be 64-char hex' });
  }

  switch (mode) {
    case 'txt-xml':
    case 'txt-json': {
      if (!body.content) return res.status(400).json({ error: 'content & key required' });
      if (!delimiter)    return res.status(400).json({ error: 'delimiter required' });
      // validación sencilla: debe tener al menos 6 campos delimitados
      if (body.content.split(delimiter).length < 6) {
        return res.status(400).json({ error: 'Formato TXT inválido' });
      }
      break;
    }
    case 'xml-txt': {
      if (!body.xml) return res.status(400).json({ error: 'xml & key required' });
      const validationResult = XMLValidator.validate(body.xml); // Use XMLValidator.validate
      if (validationResult !== true) {
        // Added validation error details for easier debugging
        return res.status(400).json({ error: 'XML mal formado', details: validationResult.err });
      }
      break;
    }
    case 'json-txt': {
      if (!body.json) return res.status(400).json({ error: 'json & key required' });
      try {
        // Ensure it's a valid JSON structure that can be stringified and parsed
        // For example, if body.json is already an object from express.json() middleware
        // this check is more about ensuring it's not undefined or a problematic type.
        // If it was a string, JSON.parse would be needed first.
        // Assuming body.json is already a JS object/array due to express.json()
        if (typeof body.json !== 'object' || body.json === null) {
            throw new Error('Invalid JSON object');
        }
        // Attempt to stringify to catch potential circular references or other issues, though less common for typical API payloads
        JSON.stringify(body.json);
      }
      catch (e) {
        return res.status(400).json({ error: 'JSON inválido', details: e.message });
      }
      break;
    }
    default:
      return res.status(400).json({ error: 'Modo de validación desconocido' });
  }

  next();
};

module.exports = validator;