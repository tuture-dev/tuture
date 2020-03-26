import { message } from 'antd';
import { isCommitEqual } from '../utils/commit';

const diff = {
  state: {
    diff: null,
  },
  reducers: {
    setDiffData(state: any, payload: any) {
      state.diff = payload;
      return state;
    },
  },
  effects: (dispatch: any) => ({
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
  selectors: (slice: Function, createSelector: any, hasProps: Function) => ({
    getDiffItemByCommitAndFile: hasProps((__: any, props: any) => {
      return slice((diffModel: any) => {
        const emptyVal = { chunks: [] };
        if (!diffModel?.diff) {
          return emptyVal;
        }

        const commit = diffModel.diff.filter((item: any) =>
          isCommitEqual(item.commit, props.commit),
        )[0];

        if (!commit) {
          return emptyVal;
        }

        return (
          commit.diff.filter((item: any) => item.to === props.file)[0] ||
          emptyVal
        );
      });
    }),
  }),
};

export default diff;
