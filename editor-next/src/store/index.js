import { init } from '@rematch/core';
import immerPlugin from '@rematch/immer';
import selectPlugin from '@rematch/select';
import createLoadingPlugin from '@rematch/loading';

import * as models from '../models';

const loadingOptions = {};
let devtoolOptions = { disabled: true };

if (process.env.NODE_ENV === 'development') {
  devtoolOptions = {
    ...devtoolOptions,
    trace: true,
    disabled: false,
    shouldCatchErrors: true,
  };
}

const store = init({
  models,
  plugins: [immerPlugin(), selectPlugin(), createLoadingPlugin(loadingOptions)],
  redux: {
    devtoolOptions,
  },
});

export default store;
