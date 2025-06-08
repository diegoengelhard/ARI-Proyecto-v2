function wktToGeoJson(wkt = '') {
  if (!wkt || !/^POLYGON/i.test(wkt)) return wkt;

  const coordsStr = wkt
    .replace(/POLYGON\s*\(\(/i, '')
    .replace(/\)\)/, '')
    .trim();

  const coords = coordsStr.split(/,\s*/).map(pair => {
    const [lng, lat] = pair.trim().split(/\s+/).map(Number);
    return [lng, lat];
  });

  return { type: 'Polygon', coordinates: [coords] };
}

function geoJsonToWkt(geo) {
  if (!geo || geo.type !== 'Polygon') return '';
  const pairs = geo.coordinates[0].map(([lng, lat]) => `${lng} ${lat}`).join(', ');
  return `POLYGON ((${pairs}))`;
}

module.exports = { wktToGeoJson, geoJsonToWkt };
