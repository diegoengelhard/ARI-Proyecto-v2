/*
  Este middleware se encarga de validar el cuerpo (req.body) antes de que llegue al controlador de conversión. Recibe un parámetro mode que le dice qué ruta estamos comprobando (txt-xml, xml-txt, etc.). Si halla algún problema, responde con HTTP 400 y un mensaje claro; de lo contrario llama a next() para que la petición continúe.
*/
const { XMLValidator } = require('fast-xml-parser');

const validator = mode => (req, res, next) => {
  const { body } = req;
  const { key, delimiter } = body;

  // clave AES-256-GCM obligatoria
  if (!key || !/^[0-9a-fA-F]{64}$/.test(key)) {
    return res.status(400).json({ error: 'Error: key must be 64-char hex' });
  }

  switch (mode) {
    case 'txt-xml':
    case 'txt-json': {
      // Verifica que el contenido no venga vacío
      if (!body.content) return res.status(400).json({ error: 'Error: Contenido & llave requeridos' });
      
      // Verifica que el delimitador sea válido y no esté vacío
      if (!delimiter)    return res.status(400).json({ error: 'Error: Delimitador requerido' });

      // Vertfica que el contenido tenga entre 7 y 8 partes
      const partsCount = body.content.split(delimiter).length;
      if (partsCount < 7 || partsCount > 8) {
        return res.status(400).json({ error: 'Formato TXT o delimitador inválido' });
      }
      break;
    }
    case 'xml-txt': {
      // Verifica que el contenido no venga vacío
      if (!body.xml) return res.status(400).json({ error: 'Error: xml & llave requeridos' });
      
      // Valida que el XML esté bien formado
      const validationResult = XMLValidator.validate(body.xml); 
      if (validationResult !== true) {
        return res.status(400).json({ error: 'XML mal formado', details: validationResult.err });
      }
      break;
    }
    case 'json-txt': {
      // Verifica que el contenido no venga vacío
      if (!body.json) return res.status(400).json({ error: 'Error: json & key requerido' });
      try {
        // Verifica que el JSON sea un objeto válido
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
