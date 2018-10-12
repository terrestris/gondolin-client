import React from 'react';
import {HashRouter} from 'react-router-dom';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import websocket from './websocket.js';

import Root from './components/Root/Root.jsx';

import store from './store/store';
import './index.less';
import i18n from './i18n';

import { LocaleProvider } from 'antd';
import german from '../node_modules/antd/lib/locale-provider/de_DE';

websocket.onopen = () => {
  const jwt = localStorage.getItem('gondolin_jwt');
  if (jwt) {
    websocket.send(JSON.stringify({
      jwt: localStorage.getItem('gondolin_jwt'),
      message: 'connect'
    }));
  }
};

render(
  <I18nextProvider i18n={i18n}>
    <LocaleProvider locale={german}>
      <Provider store={store}>
        <HashRouter>
          <Root />
        </HashRouter>
      </Provider>
    </LocaleProvider>
  </I18nextProvider>
  ,
  document.getElementById('app')
);
