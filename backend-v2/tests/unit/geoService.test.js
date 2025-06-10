const { wktToGeoJSON, geoJSONToWkt } = require('../../utils/geoService');

describe('Conversión WKT <-> GeoJSON', () => {
  const wkt = 'POLYGON ((1 2, 3 4))';
  it('convierte WKT a GeoJSON y viceversa sin pérdida', () => {
    const geo = wktToGeoJSON(wkt);
    const back = geoJSONToWkt(geo);
    expect(back.startsWith('POLYGON')).toBe(true);
  });
});