import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import OlMap from 'ol/Map';

import {
  Checkbox,
  Input,
  Select,
  Spin

} from 'antd';

import {
  AddWmsLayerEntry,
  SimpleButton,
  Titlebar
} from '@terrestris/react-geo';

import MapUtil from '@terrestris/ol-util/src/MapUtil/MapUtil';
import CapabilitiesUtil from '@terrestris/ol-util/src/CapabilitiesUtil/CapabilitiesUtil';

import './WmsPanel.less';
import { EventLogger } from '../../../util/EventLogger';

@translate()
class WmsPanel extends React.Component {
  static propTypes = {
    map: PropTypes.instanceOf(OlMap).isRequired,
    dispatch: PropTypes.func,
    t: PropTypes.func,
    onCancel: PropTypes.func
  };

  /**
   * The defaultProps.
   * @type {Object}
   */
  static defaultProps = {
    onCancel: ()=>{}
  }

  constructor(params) {
    super(params);
    this.state = {
      fetching: false,
      url: 'https://ows.terrestris.de/osm/service?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities',
      layers: [],
      selectedLayers: []
    };
  }

  /**
   *
   * @param {*} url
   */
  getCapabilities = url => {
    const { t } = this.props;
    this.setState({fetching: true});
    CapabilitiesUtil.parseWmsCapabilities(url)
      .then(capabilities => CapabilitiesUtil.getLayersFromWmsCapabilties(capabilities, 'Title'))
      .then(layers => {this.setState({layers});})
      .catch(() => EventLogger.log(t('WmsPanel.capabilitiesParseError'), 'warning', 'Add WMS'))
      .finally(() => {this.setState({fetching: false});});
  }

  /**
   *
   * @param {*} selectedLayerTitles
   */
  onSelectionChange = selectedLayerTitles => {
    const filteredLayers = this.state.layers.filter(
      layer => selectedLayerTitles.includes(layer.get('title'))
    );
    this.setState({
      selectedLayers: filteredLayers
    });
  }

  /**
   *
   */
  onAddAllLayers = () => {
    const layers = this.state.layers;
    this.addLayers(layers);
  }

  /**
   *
   */
  onAddSelectedLayer = () => {
    const layers = this.state.selectedLayers;
    this.addLayers(layers);
  }

  /**
   *
   * @param {*} layers
   */
  addLayers = layers => {
    const map = this.props.map;
    const targetGroup = MapUtil.getLayerByName(map, 'Externe Layer');

    if (layers.length > 0) {
      targetGroup.set('hideInLayertree', false);
    }

    layers.forEach(layer => {
      if (!targetGroup.getLayers().getArray().includes(layer) ) {
        targetGroup.getLayers().push(layer);
      }
    });
  }

  /**
   *
   * @param {*} selectedUrl
   */
  handleSelectChange = selectedUrl => {
    this.setState({url: selectedUrl});
    this.getCapabilities(selectedUrl);
  }

  render() {
    const {
      fetching,
      layers,
      selectedLayers,
      url
    } = this.state;
    const {
      onCancel,
      t
    } = this.props;

    return (
      <div className="wms-panel">
        <div className="wms-panel-body">
          <div className="get-capabilities-url">
            <span className="get-capabilities-url-label">
              {t('WmsPanel.geoNrwLayers')}
            </span>
            <Select
              notFoundContent={fetching ? <Spin size="small" /> : null}
              onChange={this.handleSelectChange}
            >
              <Select.OptGroup label={t('WmsPanel.drillings')}>
                <Select.Option value="https://www.wms.nrw.de/gd/bohrungen?VERSION=1.3.0&SERVICE=WMS&REQUEST=GetCapabilities">
                  {t('WmsPanel.drillingsNrw')}
                </Select.Option>
              </Select.OptGroup>
              <Select.OptGroup label={t('WmsPanel.soilMap')}>
                <Select.Option value="https://www.wms.nrw.de/gd/BK05_Uebersichtskarte?VERSION=1.3.0&amp;SERVICE=WMS&amp;REQUEST=GetCapabilities">
                  {t('WmsPanel.soilMapOverview')}
                </Select.Option>
                <Select.Option value="https://www.wms.nrw.de/gd/bk050_bis_20161231?REQUEST=GetCapabilities&SERVICE=WMS&VERSION=1.3.0">
                  {t('WmsPanel.soilMapDetail')}
                </Select.Option>
              </Select.OptGroup>
              <Select.OptGroup label={t('WmsPanel.geology')}>
                <Select.Option value="https://www.wms.nrw.de/gd/guek500?VERSION=1.3.0&SERVICE=WMS&REQUEST=GetCapabilities">
                  {t('WmsPanel.geologicalOverview')}
                </Select.Option>
                <Select.Option value="https://www.wms.nrw.de/gd/GK100?VERSION=1.3.0&SERVICE=WMS&REQUEST=GetCapabilities">
                  {t('WmsPanel.geologicalMap')}
                </Select.Option>
              </Select.OptGroup>
              <Select.OptGroup label={t('WmsPanel.geothermics')}>
                <Select.Option value="https://www.wms.nrw.de/gd/GT50?VERSION=1.3.0&SERVICE=WMS&REQUEST=GetCapabilities">
                  {t('WmsPanel.nearSurfaceMap')}
                </Select.Option>
              </Select.OptGroup>
              <Select.OptGroup label={t('WmsPanel.hydrogeology')}>
                <Select.Option value="https://www.wms.nrw.de/gd/huek500?VERSION=1.3.0&SERVICE=WMS&REQUEST=GetCapabilities">
                  {t('WmsPanel.hydroOverview')}
                </Select.Option>
                <Select.Option value="https://www.wms.nrw.de/gd/hk100?VERSION=1.3.0&SERVICE=WMS&REQUEST=GetCapabilities">
                  {t('WmsPanel.hydroMap')}
                </Select.Option>
                <Select.Option value="https://services.bgr.de/wms/grundwasser/huek200_ogwl/?SERVICE=WMS&REQUEST=GetCapabilities">
                  {t('WmsPanel.hydroOverviewGermany')}
                </Select.Option>
                <Select.Option value="https://services.bgr.de/wms/grundwasser/sgwu/?SERVICE=WMS&REQUEST=GetCapabilities">
                  {t('WmsPanel.hydroGroundWater')}
                </Select.Option>
                <Select.Option value="https://services.bgr.de/wms/grundwasser/huek200_hgw/?SERVICE=WMS&REQUEST=GetCapabilities">
                  {t('WmsPanel.hydroBackground')}
                </Select.Option>
              </Select.OptGroup>
              <Select.OptGroup label={t('WmsPanel.resources')}>
                <Select.Option value="https://www.wms.nrw.de/gd/ruek1000?VERSION=1.3.0&SERVICE=WMS&REQUEST=GetCapabilities">
                  {t('WmsPanel.resourcesOverview')}
                </Select.Option>
                <Select.Option value="https://www.wms.nrw.de/gd/ruek500?VERSION=1.3.0&SERVICE=WMS&REQUEST=GetCapabilities">
                  {t('WmsPanel.resourcesOverview2')}
                </Select.Option>
                <Select.Option value="https://www.wms.nrw.de/gd/RK50L?VERSION=1.3.0&SERVICE=WMS&REQUEST=GetCapabilities">
                  {t('WmsPanel.unconsolidatedRock')}
                </Select.Option>
                <Select.Option value="https://www.wms.nrw.de/gd/RK050F?VERSION=1.3.0&SERVICE=WMS&REQUEST=GetCapabilities">
                  {t('WmsPanel.consolidatedRock')}
                </Select.Option>
              </Select.OptGroup>
              <Select.OptGroup label={t('WmsPanel.orthoFotos')}>
                <Select.Option value="https://www.wms.nrw.de/geobasis/wms_nw_dop?VERSION=1.3.0&SERVICE=WMS&REQUEST=GetCapabilities">
                  {t('WmsPanel.orthoFotos')}
                </Select.Option>
              </Select.OptGroup>
            </Select>
            <span className="get-capabilities-url-label">
              {t('WmsPanel.url')}
            </span>
            <Input.Search
              placeholder={t('WmsPanel.enterUrl')}
              value={url}
              onChange={event => {
                const url = event.target.value;
                this.setState({url});
              }}
              onSearch={this.getCapabilities}
              enterButton
            />
          </div>
          <Checkbox.Group
            onChange={this.onSelectionChange}
          >
            {fetching ? t('General.loading') : layers.map((layer, idx) => {
              return <AddWmsLayerEntry
                wmsLayer={layer}
                key={idx} />;
            })}
          </Checkbox.Group>
        </div>
        <Titlebar
          style={{
            minHeight: '34px'
          }}
          tools={[
            <SimpleButton
              size="small"
              key="useSelectedBtn"
              disabled={selectedLayers.length === 0}
              onClick={this.onAddSelectedLayers}
            >
              {t('WmsPanel.addSelectedLayers')}
            </SimpleButton>,
            <SimpleButton
              size="small"
              key="useAllBtn"
              disabled={layers.length === 0}
              onClick={this.onAddAllLayers}
            >
              {t('WmsPanel.addAllLayers')}
            </SimpleButton>,
            onCancel ?
              <SimpleButton
                size="small"
                key="cancelBtn"
                onClick={onCancel}
              >
                {t('General.cancel')}
              </SimpleButton> : null
          ]} />
      </div>
    );
  }
}

export default WmsPanel;
