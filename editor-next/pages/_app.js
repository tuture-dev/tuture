import React from 'react';
import { Provider } from 'react-redux';
import NextApp, { Container } from 'next/app';
import withRedux from 'next-redux-wrapper';
import { CacheProvider } from '@emotion/core';
import { cache } from 'emotion';

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
      <Container>
        <Provider store={store}>
          <CacheProvider value={cache}>
            {globalStyles}
            <ConnectedLayout>
              <Component {...pageProps} />
            </ConnectedLayout>
          </CacheProvider>
        </Provider>
      </Container>
    );
  }
}

export default withRedux(makeStore)(MyApp);
