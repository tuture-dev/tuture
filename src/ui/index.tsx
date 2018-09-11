/* tslint:disable-next-line */
import React from 'react';
import { hydrate } from 'react-dom';
import io from 'socket.io-client';
import { Provider } from 'mobx-react';
import { I18nextProvider } from 'react-i18next';

import Store from './store';
import i18n from '../i18n.client';

function unescape(s: any) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

import App from './components/App';

const diff = window.__APP_INITIAL_DIFF__;
const tuture = window.__APP_INITIAL_TUTURE__;
const i18nClient = window.__APP_INITIAL_I18N__;

i18n.changeLanguage(i18nClient.locale);
i18n.addResourceBundle(
  i18nClient.locale,
  'translations',
  i18nClient.resources,
  true,
);

const store = new Store();

hydrate(
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <App
        tuture={unescape(JSON.stringify(tuture))}
        diff={unescape(JSON.stringify(diff))}
      />
    </Provider>
  </I18nextProvider>,
  document.getElementById('root'),
);

// Add socket.io client implementation.
const socket = io();

socket.on('connect', () => {
  console.log('connected to tuture-server!');
});

socket.on('reload', () => {
  document.location.reload(true);
});
