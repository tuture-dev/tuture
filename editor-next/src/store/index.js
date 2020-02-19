import { init } from '@rematch/core';
import immerPlugin from '@rematch/immer';
import selectPlugin from '@rematch/select';
import createLoadingPlugin from '@rematch/loading';

import * as models from '../models';

const loadingOptions = {};

const store = init({
  models,
  plugins: [immerPlugin(), selectPlugin(), createLoadingPlugin(loadingOptions)],
  redux: {
    devtoolOptions: {
      trace: true,
    },
  },
});

export default store;
