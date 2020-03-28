import { init, RematchDispatch, RematchRootState } from '@rematch/core';
import immerPlugin from '@rematch/immer';
import selectPlugin from '@rematch/select';
import createLoadingPlugin from '@rematch/loading';

import * as models from '../models';

const loadingOptions = {};
const devtoolOptions = {
  trace: true,
  shouldCatchErrors: true,
  disabled: !(process.env.NODE_ENV === 'development'),
};

export const store = init({
  models,
  plugins: [immerPlugin(), selectPlugin(), createLoadingPlugin(loadingOptions)],
  redux: {
    devtoolOptions,
  },
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<typeof models>;
export type RootState = RematchRootState<typeof models>;
