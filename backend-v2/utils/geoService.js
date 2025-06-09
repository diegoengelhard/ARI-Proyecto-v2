function wktToGeoJson(wkt='') {
  if (!/^POLYGON/i.test(wkt)) return wkt;
  const coords = wkt.replace(/POLYGON\s*\(\(/i,'')
                    .replace(/\)\)/,'')
                    .split(/,\s*/)
                    .map(p=>p.trim().split(/\s+/).map(Number));
  return { type:'Polygon', coordinates:[coords] };
}

function geoJsonToWkt(geo) {
  if (!geo || geo.type!=='Polygon') return '';
  const pairs = geo.coordinates[0].map(([lng,lat])=>`${lng} ${lat}`).join(', ');
  return `POLYGON ((${pairs}))`;
}

module.exports = { wktToGeoJson, geoJsonToWkt };
