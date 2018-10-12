import OlStyleStyle from 'ol/style/Style';
import OlStyleFill from 'ol/style/Fill';
import OlStyleCircle from 'ol/style/Circle';
import OlStyleStroke from 'ol/style/Stroke';

class AppConfig {

  /**
   * The primary color.
   * @type {String} primaryColor
   */
  primaryColor = '#0e1058';

  /**
   * The secondary color.
   * @type {String} secondaryColor
   */
  secondaryColor = '#b94800';

  /**
   * Configure the application header here.
   * @type {Object} header
   */
  header = {
    /**
     * The path to the logo image used for the application. Relative to the
     * resources img folder.
     * @type {String} logo
     */
    logo: 'BMEL_Logo.svg',
    /**
     * The title off the application. Displayed in the header.
     * @type {String} header
     */
    title: 'gondolin Client'
  };

  api = {
    development: 'http://localhost:3000',
    test: 'api',
    production: `${window.location.protocol}//${window.location.host}`
  };

  websocket = {
    development: 'ws://localhost:3000/websocket',
    test: 'api',
    production: `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/websocket`
  };

  upload = {
    development: 'ws://localhost:3000/upload',
    test: 'api',
    production: `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/upload`
  };

  /**
   * The geoserver configuration for the diffrent environments.
   * Currently contains:
   *   baseUrl - The baseUrl to the geoserver.
   * @type {Object} geoServerDefaults
   */
  geoServerDefaults = {
    development: {
      baseUrl: 'http://gondolin-intern/geoserver/ows'
    },
    test: {
      baseUrl: '/geoserver/ows'
    },
    production: {
      baseUrl: '/geoserver/ows'
    }
  };

  /**
   * The logger configuration for the diffrent environments.
   * @type {Object} logger
   */
  logger = {
    development: {
      level: 'DEBUG'
    },
    test: {
      level: 'DEBUG'
    },
    production: {
      level: 'INFO'
    }
  };

  /**
   * The mapView configuration.
   * Currently contains:
   *   zoom - The initial zoomlevel.
   *   center - The initial center coordinate.
   *   featureInfoActive - Should the featureInfo be activated from start.
   * @type {Object} mapView
   */
  mapView = {
    zoom: 16,
    projection: 'EPSG:3857',
    resolutions: [560, 280, 140, 70, 28, 14, 7, 2.8, 1.4, 0.7, 0.28, 0.14, 0.028],
    center: [778548, 6553163],
    featureInfoActive: true
  };

  /**
   * An ol.style.Style (or stylefunction) representing the style for the
   * hoverLayer.
   * @type {ol.style.Style} selectLayerStyle
   */
  featureLayerStyle = new OlStyleStyle({
    fill: new OlStyleFill({
      color: 'rgba(11, 82, 5, 0.1)'
    }),
    stroke: new OlStyleStroke({
      color: 'rgba(11, 82, 5, 0.7)',
      width: 3
    }),
    image: new OlStyleCircle({
      radius: 4,
      fill: new OlStyleFill({
        color: 'rgba(11, 82, 5, 0.1)'
      }),
      stroke: new OlStyleStroke({
        color: 'rgba(11, 82, 5, 0.7)',
        width: 1.5
      })
    })
  });

  /**
   * An ol.style.Style (or stylefunction) representing the style for the
   * hoverLayer.
   * @type {ol.style.Style} selectLayerStyle
   */
  hoverLayerStyle = new OlStyleStyle({
    fill: new OlStyleFill({
      color: 'rgba(0, 76, 255, 0.1)'
    }),
    stroke: new OlStyleStroke({
      color: 'rgba(0, 76, 255, 0.66)',
      width: 3
    }),
    image: new OlStyleCircle({
      radius: 4,
      fill: new OlStyleFill({
        color: 'rgba(0, 76, 255, 1)'
      })
    })
  });

  /**
   * An ol.style.Style (or stylefunction) representing the style for the
   * selectLayer.
   * @type {ol.style.Style} selectLayerStyle
   */
  selectLayerStyle = new OlStyleStyle({
    fill: new OlStyleFill({
      color: 'rgba(255, 179, 0, 0.1)'
    }),
    stroke: new OlStyleStroke({
      color: 'rgba(255, 179, 0, 0.66)',
      width: 3
    }),
    image: new OlStyleCircle({
      radius: 4,
      fill: new OlStyleFill({
        color: 'rgba(255, 179, 0, 1)'
      })
    })
  });

  /**
   *
   */
  autoStyleColors = [
    '#0080FF',
    '#0990D0',
    '#12A0A2',
    '#1BB073',
    '#24C045',
    '#2ED017',
    '#57D912',
    '#81E20D',
    '#ABEC09',
    '#D5F504',
    '#FFFF00',
    '#FFE500',
    '#FFCC00',
    '#FFB200',
    '#FF9900',
    '#FF8000',
    '#F56F09',
    '#EC5F12',
    '#E24E1B',
    '#D93E24',
    '#D02E2E',
    '#aa0000'
  ];

  /**
   * An array if layer configurations.
   * Each layer can have the following configs:
   *   type - The layer type: ['wms','wfs','osm']
   *   id - A manually given id for each layer. //TODO we should get rid of this
   *   queryable - Should the layer be queryable (hoverable).
   *   hoverTemplate - A Stringtemplate which will be shown in the hover popover.
   *   url - The baseUrl of the ows-server. In most cases this will be the
   *   baseUrl - from the geoServerDefaults config.
   *   params - Any url params. 'LAYERS' will be required in most cases.
   * @type {Array} mapLayers
   */
  mapLayers = [
    {
      type: 'folder',
      name: 'Traktorfotos',
      layers: [
        {
          name: 'CW17KAWW_traktor_170704',
          source: {
            type: 'WFS',
            url: this.geoServerDefaults[process.env.NODE_ENV].baseUrl,
            version: '2.0.2',
            typeName: 'gondolin:CW17KAWW_traktor_170704'
          },
          appearance: {
            opacity: 1.0,
            visible: true
          }
        }
      ]
    },
    {
      type: 'folder',
      name: 'Imports',
      layers: []
    },
    {
      type: 'folder',
      name: 'Externe Layer',
      layers: [],
      hideInLayertree: true
    },
    {
      type: 'folder',
      name: 'Hintergrundkarten',
      layers: [
        {
          name: 'OSM WMS',
          source: {
            type: 'TileWMS',
            url: 'http://ows.terrestris.de/osm/service',
            width: 256,
            height: 256,
            version: '1.3.0',
            layerNames: 'OSM-WMS'
          },
          appearance: {
            attribution: '',
            hoverable: false,
            properties: {},
            maxResolution: null,
            minResolution: null,
            opacity: 1.0,
            visible: true
          }
        },
        {
          name: 'OSM WMS Grau',
          source: {
            type: 'TileWMS',
            url: 'http://ows.terrestris.de/osm-gray/service',
            width: 256,
            height: 256,
            version: '1.3.0',
            layerNames: 'OSM-WMS'
          },
          appearance: {
            attribution: '',
            hoverable: false,
            properties: {},
            maxResolution: null,
            minResolution: null,
            opacity: 1.0,
            visible: false
          }
        }
      ]
    }
  ];

}

export const appConfig = new AppConfig();
