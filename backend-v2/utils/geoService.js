/**
 * Convierte un texto WKT de tipo POLYGON a un objeto GeoJSON Polygon.
 * @param {string} wkt - Texto WKT que representa un polígono.
 * @returns {Object} Objeto GeoJSON con tipo 'Polygon' y coordenadas del polígono.
 */
function wktToGeoJSON(wkt = '') {
  if (!/^POLYGON/i.test(wkt)) return wkt; // Si no es un POLYGON, retorna el texto original
  
  const coords = wkt
    .replace(/POLYGON\s*\(\(/i, '') // Elimina el prefijo POLYGON ((
    .replace(/\)\)/, '') // Elimina el sufijo ))
    .split(/,\s*/) // Divide por comas y espacios
    .map(p => p.trim().split(/\s+/).map(Number)); // Por cada vertice, convierte a [lng, lat]
  return { type: 'Polygon', coordinates: [coords] }; // Devuelve un GeoJSON Polygon
}

/**
 * Convierte un objeto GeoJSON de tipo Polygon a texto WKT.
 * @param {Object} geo - Objeto GeoJSON con tipo 'Polygon' y coordenadas.
 * @return {string} Texto WKT que representa el polígono, o cadena vacía si no es un Polygon válido.
 */
function geoJSONToWkt(geo) {
  if (!geo || geo.type !== 'Polygon') return ''; // Solo convierte Polygon. Si es null, otro tipo o mal formado, retorna cadena vacía.
  
  const pairs = geo.coordinates[0] // Toma el primer anillo del polígono
    .map(([lng, lat]) => `${lng} ${lat}`) // Convierte cada par [lng, lat] a string "lng lat"
    .join(', '); // Une con commas 
  
    return `POLYGON ((${pairs}))`; // Devuelve el texto WKT del polígono
}

// Convierte un texto WKT de tipo POINT a un objeto GeoJSON Point.
/**
 * Convierte un texto WKT de tipo POINT a un objeto GeoJSON Point.
 * @param {string} wktPoint - Texto WKT que representa un punto.
 * @returns {Object|string} Objeto GeoJSON con tipo 'Point' y coordenadas [lng, lat], o el texto original si no es un POINT válido.
 */
function wktPointToGeoJSON(wktPoint = '') {
  if (typeof wktPoint !== 'string' || !wktPoint.toUpperCase().startsWith('POINT')) {
    return wktPoint; // si no es POINT, se devuelve tal cual
  }

  // Usa regex para capturar dos números (lng lat) dentro del paréntesis
  const coordMatch = wktPoint.match(/POINT\s*\(\s*([+-]?\d*\.?\d+)\s+([+-]?\d*\.?\d+)\s*\)/i);

  // Si la captura es válida y ambos valores son numéricos, devuelve el GeoJSON Point
  if (coordMatch && coordMatch.length === 3) {
    const lng = parseFloat(coordMatch[1]); // Convierte el primer número a float (longitud)
    const lat = parseFloat(coordMatch[2]); // Convierte el segundo número a float (latitud)
    if (!isNaN(lng) && !isNaN(lat)) { // Verifica que ambos sean números válidos
      return { type: 'Point', coordinates: [lng, lat] }; // Devuelve el objeto GeoJSON Point
    }
  }

  return wktPoint; // Si no es un POINT válido, devuelve el texto original
}

/**
 * Convierte un objeto GeoJSON Point a texto WKT.
 * @param {Object} geoPoint - Objeto GeoJSON con tipo 'Point' y coordenadas [lng, lat].
 * @returns {string} Texto WKT que representa el punto, o cadena vacía si no es un Point válido.
 */
function geoJSONPointToWkt(geoPoint) {
  // Valida que sea un objeto Point con exactamente 2 números
  if (geoPoint && geoPoint.type === 'Point' && Array.isArray(geoPoint.coordinates) && geoPoint.coordinates.length === 2) {
    const [lng, lat] = geoPoint.coordinates; // Desestructura las coordenadas e.g. [lng, lat]
    // Verifica que ambos sean números y no NaN
    if (typeof lng === 'number' && typeof lat === 'number' && !isNaN(lng) && !isNaN(lat)) {
      return `POINT (${lng} ${lat})`; // Devuelve el texto WKT del punto
    }
  }
  return ''; // Si no es un Point válido, devuelve cadena vacía
}

module.exports = { wktToGeoJSON, geoJSONToWkt, wktPointToGeoJSON, geoJSONPointToWkt };
