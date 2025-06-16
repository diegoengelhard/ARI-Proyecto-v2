function wktToGeoJSON(wkt = '') {
  if (!/^POLYGON/i.test(wkt)) return wkt;        // no tocamos si no es polygon
  const coords = wkt
    .replace(/POLYGON\s*\(\(/i, '')
    .replace(/\)\)/, '')
    .split(/,\s*/)
    .map(p => p.trim().split(/\s+/).map(Number));
  return { type: 'Polygon', coordinates: [coords] };
}

function geoJSONToWkt(geo) {
  if (!geo || geo.type !== 'Polygon') return '';
  const pairs = geo.coordinates[0]
    .map(([lng, lat]) => `${lng} ${lat}`)
    .join(', ');
  return `POLYGON ((${pairs}))`;
}

function wktPointToGeoJSON(wktPoint = '') {
  if (typeof wktPoint !== 'string' || !wktPoint.toUpperCase().startsWith('POINT')) {
    return wktPoint; // Return as is if not a POINT string
  }
  const coordMatch = wktPoint.match(/POINT\s*\(\s*([+-]?\d*\.?\d+)\s+([+-]?\d*\.?\d+)\s*\)/i);
  if (coordMatch && coordMatch.length === 3) {
    const lng = parseFloat(coordMatch[1]);
    const lat = parseFloat(coordMatch[2]);
    if (!isNaN(lng) && !isNaN(lat)) {
      return { type: 'Point', coordinates: [lng, lat] };
    }
  }
  return wktPoint; // Return original if parsing failed
}

function geoJSONPointToWkt(geoPoint) {
  if (geoPoint && geoPoint.type === 'Point' && Array.isArray(geoPoint.coordinates) && geoPoint.coordinates.length === 2) {
    const [lng, lat] = geoPoint.coordinates;
    if (typeof lng === 'number' && typeof lat === 'number' && !isNaN(lng) && !isNaN(lat)) {
      return `POINT (${lng} ${lat})`;
    }
  }
  return ''; // Return empty string if not a valid GeoJSON Point
}

module.exports = { wktToGeoJSON, geoJSONToWkt, wktPointToGeoJSON, geoJSONPointToWkt };
