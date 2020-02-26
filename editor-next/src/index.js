import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import ConnectedLayout from './components/ConnectedLayout';
import { globalStyles } from './shared/styles';
import store from './store';
import * as serviceWorker from './serviceWorker';

import Home from './pages/Home';
import Article from './pages/Article';
import Toc from './pages/Toc';

ReactDOM.render(
  <Provider store={store}>
    {globalStyles}
    <Router>
      <ConnectedLayout>
        <Route path="/articles/:id">
          <Article />
        </Route>
        <Route path="/toc">
          <Toc />
        </Route>
        <Route path="/" exact>
          <Home />
        </Route>
      </ConnectedLayout>
    </Router>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
