const { XMLValidator } = require('fast-xml-parser');

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
      if (!body.content) return res.status(400).json({ error: 'Error: Contenido & llave requerida' });
      if (!delimiter)    return res.status(400).json({ error: 'Error: Delimitador requerido' });

      const partsCount = body.content.split(delimiter).length;
      if (partsCount < 7 || partsCount > 8) {
        return res.status(400).json({ error: 'Formato TXT o delimitador inválido' });
      }
      break;
    }
    case 'xml-txt': {
      if (!body.xml) return res.status(400).json({ error: 'Error: xml & llave requerido' });
      const validationResult = XMLValidator.validate(body.xml); 
      if (validationResult !== true) {
        return res.status(400).json({ error: 'XML mal formado', details: validationResult.err });
      }
      break;
    }
    case 'json-txt': {
      if (!body.json) return res.status(400).json({ error: 'Error: json & key requerido' });
      try {
        if (typeof body.json !== 'object' || body.json === null) {
            throw new Error('Invalid JSON object');
        }
        JSON.stringify(body.json);
      }
      catch (e) {
        return res.status(400).json({ error: 'Error: JSON inválido', details: e.message });
      }
      break;
    }
    default:
      return res.status(400).json({ error: 'Error: Modo de validación desconocido' });
  }

  next();
};

module.exports = validator;
