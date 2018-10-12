import LayerParser from './LayerParser';

import OlMap from 'ol/Map';
import OlTileWMS from 'ol/source/TileWMS';
import OlLayerTile from 'ol/layer/Tile';
import OlLayerGroup from 'ol/layer/Group';
import OlView from 'ol/View';
import {
  get as OlGetProjection
} from 'ol/proj';
import {
  defaults as OlDefaultControls
} from 'ol/control';

import MapUtil from '@terrestris/ol-util/src/MapUtil/MapUtil';

import {appConfig} from '../config/app.config.js';

const env = process.env.NODE_ENV;
const api = appConfig.api[env];

/**
 * Helper Class for Colors
 */
export class MapUtils {

  /**
   * The setupMap function
   *
   * initialize the OL map and its components
   *
   * @method setupMap
   */
  static setupMap(state) {
    const {
      mapView: {
        zoom,
        center,
        projection,
        resolutions
      },
      mapLayers
    } = state;

    const mapView = new OlView({
      center: center,
      zoom: zoom,
      projection: OlGetProjection(projection),
      resolutions: resolutions
    });

    const layers = LayerParser.parseLayers(mapLayers);

    const map = new OlMap({
      target: 'map',
      layers: layers,
      view: mapView,
      keyboardEventTarget: document,
      controls: OlDefaultControls({
        zoom: false,
        attributionOptions: {
          collapsible: true
        }
      })
    });

    this.getImportLayerRasterFiles()
      .then(rasterFiles => {
        rasterFiles.forEach(rasterFile => MapUtils.addImportLayer(rasterFile, map));
      }).catch(err => {
        Error(`Error adding import Layers: ${err}`);
      });

    return map;
  }

  /**
   * Adds a single import layer with the given name.
   * @param {RasterFile} rasterFile The rasterFile
   * @param {ol.Map} map the openlayers map
   */
  static addImportLayer(rasterFile, map) {
    const {
      Experiment,
      geoServerLayerName,
      type
    } = rasterFile;

    const targetGroup = MapUtil.getLayerByName(map, 'Imports');

    let experimentGroup = MapUtil.getLayerByName(targetGroup, Experiment.expcode);
    if (!experimentGroup || !(experimentGroup instanceof OlLayerGroup)) {
      experimentGroup = new OlLayerGroup({name: Experiment.expcode});
      targetGroup.getLayers().push(experimentGroup);
    }

    let typeGroup = MapUtil.getLayerByName(experimentGroup, type);
    if (!typeGroup || !(typeGroup instanceof OlLayerGroup)) {
      typeGroup = new OlLayerGroup({name: type});
      experimentGroup.getLayers().push(typeGroup);
    }

    const layer = new OlLayerTile({
      source: new OlTileWMS({
        url: appConfig.geoServerDefaults[env].baseUrl,
        params: {
          'LAYERS': geoServerLayerName
        }
      }),
      visible: false,
      name: geoServerLayerName
    });
    typeGroup.getLayers().push(layer);
  }

  /**
   * Get the rasterFiles where isLayer = true, status = 'IMPORT_COMPLETE'
   * and geoServerLayerName is not null.
   *
   */
  static getImportLayerRasterFiles() {
    return new Promise((resolve, reject) => {
      return fetch(`${api}/importlayers`)
        .then(response => response.json())
        .then(response => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(Error(`Error getting import Layers.`));
          }
        });
    });
  }

}
