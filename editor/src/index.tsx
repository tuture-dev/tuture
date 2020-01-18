import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { I18nextProvider } from 'react-i18next';

import 'typeface-roboto';
import 'typeface-roboto-mono';

import i18n from './i18n';
import Store from './store';

import App from './components/App';

const store = new Store();

const fetchTasks =
  process.env.NODE_ENV === 'development'
    ? [fetch('./diff.json'), fetch('./tuture.json')]
    : [fetch('/diff'), fetch('/tuture')];

Promise.all(fetchTasks)
  .then((responses) => {
    const [diffRes, tutureRes] = responses;
    return Promise.all([diffRes.json(), tutureRes.json()]);
  })
  .then((data) => {
    const [diff, tuture] = data;

    // 过滤 tuture.steps 中可能存在的 outdated 情况
    if ('steps' in tuture) {
      tuture.steps = tuture.steps.filter((step) => !step.outdated);
    }

    ReactDOM.render(
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <App tuture={tuture} diff={diff} />
        </Provider>
      </I18nextProvider>,
      document.getElementById('root'),
    );
  });
