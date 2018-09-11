/* tslint:disable-next-line */
import React from 'react';
import { hydrate } from 'react-dom';
import io from 'socket.io-client';
import { Provider } from 'mobx-react';

import Store from './store';

function unescape(s: any) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

import App from './components/App';

const diff = window.__APP_INITIAL_DIFF__;
const tuture = window.__APP_INITIAL_TUTURE__;

const store = new Store();

hydrate(
  <Provider store={store}>
    <App
      tuture={unescape(JSON.stringify(tuture))}
      diff={unescape(JSON.stringify(diff))}
    />
  </Provider>,
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
