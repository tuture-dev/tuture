import React from 'react';
import { Provider } from 'react-redux';
import NextApp from 'next/app';
import withRedux from 'next-redux-wrapper';

import makeStore from '../store';
import { globalStyles } from '../shared/styles';
import ConnectedLayout from '../components/ConnectedLayout';

class MyApp extends NextApp {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Provider store={store}>
        {globalStyles}
        <ConnectedLayout>
          <Component {...pageProps} />
        </ConnectedLayout>
      </Provider>
    );
  }
}

export default withRedux(makeStore)(MyApp);
