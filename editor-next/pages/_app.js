import { Provider } from 'react-redux';
import NextApp from 'next/app';
import withRedux from 'next-redux-wrapper';

import makeStore from '../store';
import { EditorContext, editor } from '../utils/editor';
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
        <EditorContext.Provider value={editor}>
          <ConnectedLayout>
            <Component {...pageProps} />
          </ConnectedLayout>
        </EditorContext.Provider>
      </Provider>
    );
  }
}

export default withRedux(makeStore)(MyApp);
