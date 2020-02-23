import { message } from 'antd';

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
      return slice((diffModel) =>
        diffModel.diff
          ? diffModel.diff
              .filter((diffItem) => diffItem.commit === props.commit)[0]
              .diff.filter((diffItem) => diffItem.to === props.file)[0]
          : { chunks: [] },
      );
    }),
  }),
};

export default diff;
