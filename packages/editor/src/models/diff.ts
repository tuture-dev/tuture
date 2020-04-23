import { message } from 'antd';
import { RawDiff, isCommitEqual } from '@tuture/core';
import { Slicer, SelectorCreator, Parameterizer } from '@rematch/select';

import { Dispatch } from '../store';

export type DiffState = {
  diff: RawDiff[] | null;
};

const initialState: DiffState = { diff: null };

export const diff = {
  state: initialState,
  reducers: {
    setDiffData(state: DiffState, diff: RawDiff[]) {
      state.diff = diff;
      return state;
    },
  },
  effects: (dispatch: Dispatch) => ({
    async fetchDiff() {
      try {
        const response = await fetch('/diff');
        const data = await response.json();
        dispatch.diff.setDiffData(data);
      } catch {
        message.error('数据获取失败，请稍后重试！');
      }
    },
  }),
  selectors: (
    slice: Slicer<DiffState>,
    createSelector: SelectorCreator,
    hasProps: Parameterizer<DiffState>,
  ) => ({
    getDiffItemByCommitAndFile: hasProps(
      (__: any, props: { commit: string; file: string }) => {
        return slice((diffState: DiffState) => {
          const emptyVal = { chunks: [] };
          if (!diffState?.diff) {
            return emptyVal;
          }

          const commit = diffState.diff.filter((item: any) =>
            isCommitEqual(item.commit, props.commit),
          )[0];

          if (!commit) {
            return emptyVal;
          }

          return (
            commit.diff.filter((item) => item.to === props.file)[0] || emptyVal
          );
        });
      },
    ),
  }),
};
