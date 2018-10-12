import OlTileWMS from 'ol/source/TileWMS';
import OlLayerTile from 'ol/layer/Tile';
import OlSourceVector from 'ol/source/Vector';
import OlLayerVector from 'ol/layer/Vector';
import OlLayerGroup from 'ol/layer/Group';
import OlFormatGeoJSON from 'ol/format/GeoJSON';

import UrlUtil from '@terrestris/base-util/src/UrlUtil/UrlUtil';

import {
  reverse,
  isEmpty
} from 'lodash';

import Logger from './Logger';

/**
 * Helper Class for the ol3 map.
 *
 * @class
 */
export class LayerParser {

  /**
   * Parses an array of bismaplayers and returns an array of ol.layer.Layers.
   *
   * @static
   * @param {Array} mapLayerObjArray An array of layerObjects like we get them
   *                                 from the backend.
   * @return {Array} An array of ol.layer.Layer.
   */
  static parseLayers(mapLayerObjArray) {
    let layers = [];

    if (isEmpty(mapLayerObjArray)) {
      return layers;
    }

    mapLayerObjArray.forEach(layerObj => {
      let layer;
      if (layerObj.type === 'folder') {
        layer = new OlLayerGroup({
          name: layerObj.name,
          visible: true,
          layers: LayerParser.parseLayers(layerObj.layers),
          hideInLayertree: layerObj.hideInLayertree
        });
      } else {
        if (layerObj.source.type === 'TileWMS') {
          const layerSource = new OlTileWMS({
            url: layerObj.source.url,
            attributions: layerObj.appearance.attribution,
            params: {
              'LAYERS': layerObj.source.layerNames,
              'TILED': layerObj.source.requestWithTiled
            }
          });

          layer = new OlLayerTile({
            source: layerSource,
            visible: layerObj.appearance.visible,
            name: layerObj.name,
            opacity: layerObj.appearance.opacity,
            hoverable: layerObj.appearance.hoverable,
            hoverTemplate: layerObj.appearance.hoverTemplate
          });

        } else if (layerObj.source.type === 'WFS') {
          const {
            url: baseUrl,
            type,
            version,
            typeName
          } = layerObj.source;

          const requestParams = {
            service: type,
            request: 'GetFeature',
            outputFormat: 'application/json',
            srsName: 'EPSG:3857',
            version,
            typeName
          };

          const requestString = UrlUtil.objectToRequestString(requestParams);
          const url = `${baseUrl}?${requestString}`;
          const layerSource = new OlSourceVector({
            format: new OlFormatGeoJSON(),
            url: url // TODO think about an url function / loadingstrategy
          });

          layer = new OlLayerVector({
            source: layerSource,
            visible: layerObj.appearance.visible,
            name: layerObj.name,
            opacity: layerObj.appearance.opacity,
            hoverable: layerObj.appearance.hoverable,
            hoverTemplate: layerObj.appearance.hoverTemplate
          });

        } else {
          Logger.warn('Currently only source TileWMS and WFS are supported.');
          return false;
        }
      }
      layers.push(layer);
    });

    reverse(layers);

    return layers;
  }

}

export default LayerParser;
