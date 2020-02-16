import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';

import makeStore from '../store';
import { globalStyles } from '../shared/styles';
import ConnectedLayout from '../components/ConnectedLayout';

function MyApp({ Component, pageProps, store }) {
  return (
    <Provider store={store}>
      {globalStyles}
      <ConnectedLayout>
        <Component {...pageProps} />
      </ConnectedLayout>
    </Provider>
  );
}

export default withRedux(makeStore)(MyApp);
