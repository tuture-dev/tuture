import { init } from '@rematch/core';
import immerPlugin from '@rematch/immer';
import selectPlugin from '@rematch/select';
import createLoadingPlugin from '@rematch/loading';

import * as models from '../models/';

const initialState = {};
const loadingOptions = {};

const initializeStore = (preloadedState = initialState) =>
  init({
    models,
    plugins: [
      immerPlugin(),
      selectPlugin(),
      createLoadingPlugin(loadingOptions),
    ],
    redux: {
      initialState: preloadedState,
      devtoolOptions: {
        trace: true,
      },
    },
  });

export default initializeStore;
