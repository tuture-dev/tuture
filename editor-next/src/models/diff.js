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
      const response = await fetch(
        'https://tuture-staging-1257259601.cos.ap-shanghai.myqcloud.com/diff.json',
      );
      const data = await response.json();
      dispatch({ type: 'diff/setDiffData', payload: data });
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
