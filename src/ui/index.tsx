import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { Provider } from 'mobx-react';
import { I18nextProvider } from 'react-i18next';

import Store from './store';
import i18n from '../i18n/client';

import App from './components/App';

// Add socket.io client implementation.
const socket = io();

socket.on('connect', () => {
  console.log('connected to tuture-server!');
});

socket.on('reload', () => {
  document.location.reload(true);
});

const store = new Store();

Promise.all([
  fetch(`${location.origin}/diff`),
  fetch(`${location.origin}/tuture`),
])
  .then((responses) => {
    const [diffRes, tutureRes] = responses;
    return Promise.all([diffRes.json(), tutureRes.json()]);
  })
  .then((data) => {
    const [diff, tuture] = data;
    ReactDOM.render(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <App tuture={tuture} diff={diff} />
        </Provider>
      </I18nextProvider>,
      document.getElementById('root'),
    );
  });
