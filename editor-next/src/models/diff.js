import { message } from 'antd';
import { isCommitEqual } from '../utils/commit';

const diff = {
  state: {
    diff: null,
  },
  reducers: {
    setDiffData(state, payload) {
      state.diff = payload;
      return state;
    },
  },
  effects: (dispatch) => ({
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
  selectors: (slice, createSelector, hasProps) => ({
    getDiffItemByCommitAndFile: hasProps((__, props) => {
      return slice((diffModel) => {
        const emptyVal = { chunks: [] };
        if (!diffModel?.diff) {
          return emptyVal;
        }

        const commit = diffModel.diff.filter((item) =>
          isCommitEqual(item.commit, props.commit),
        )[0];

        if (!commit) {
          return emptyVal;
        }

        return (
          commit.diff.filter((item) => item.to === props.file)[0] || emptyVal
        );
      });
    }),
  }),
};

export default diff;
