import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import yaml from 'js-yaml';
import { I18nextProvider } from 'react-i18next';

import i18n from './i18n';
import Store from './store';

import App from './components/App';

const store = new Store();

const fetchTasks = [fetch('/diff'), fetch('/tuture')];

Promise.all(fetchTasks)
  .then((responses) => {
    const [diffRes, tutureRes] = responses;
    return Promise.all([diffRes.json(), tutureRes.text()]);
  })
  .then((data) => {
    const [diff, tuture] = data;
    ReactDOM.render(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <App tuture={yaml.safeLoad(tuture)} diff={diff} />
        </Provider>
      </I18nextProvider>,
      document.getElementById('root'),
    );
  });
