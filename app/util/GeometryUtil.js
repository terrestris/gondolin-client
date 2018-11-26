import OlFormatWKT from 'ol/format/WKT';
import OlFormatGeoJSON from 'ol/format/GeoJSON';

/**
* Helper Class for the OpenLayers map.
*/
export default class GeometryUtil {

  static transformGeoJSONtoWKT(geoJson) {
    const formatWKT = new OlFormatWKT();
    const formatGeoJSON = new OlFormatGeoJSON();
    try {
      const geoJsonGeom = formatGeoJSON.readGeometry(geoJson, {
        dataProjection: 'EPSG:4326', // Projection in database
        featureProjection: 'EPSG:25832' // Projection in grid
      });

      const wktGeom = formatWKT.writeGeometry(geoJsonGeom);
      return wktGeom;
    } catch (e) {
      // happens sometimes that the input is already wkt
      return geoJson;
    }
  }

  static transformWKTtoGeoJSON(wkt) {
    const formatWKT = new OlFormatWKT();
    const formatGeoJSON = new OlFormatGeoJSON();
    const wktGeom = formatWKT.readGeometry(wkt, {
      dataProjection: 'EPSG:25832', // Projection in grid
      featureProjection: 'EPSG:4326' // Projection in database
    });

    let geoJsonGeom = formatGeoJSON.writeGeometryObject(wktGeom);
    geoJsonGeom.crs = {
      type: 'name',
      properties: {
        name: 'EPSG:4326'
      }
    };
    return geoJsonGeom;
  }

}
