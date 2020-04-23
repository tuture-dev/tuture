import {
  init,
  Models,
  RematchDispatch,
  RematchRootState,
  ExtractRematchDispatchersFromEffects,
} from '@rematch/core';
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

export interface LoadingState<M extends Models> {
  loading: {
    global: boolean;
    models: { [modelName in keyof M]: boolean };
    effects: {
      [modelName in keyof M]: {
        [effectName in keyof ExtractRematchDispatchersFromEffects<
          M[modelName]['effects']
        >]: boolean;
      };
    };
  };
}

export type Store = typeof store;
export type Dispatch = RematchDispatch<typeof models>;
export type RootState = RematchRootState<typeof models> &
  LoadingState<typeof models>;
