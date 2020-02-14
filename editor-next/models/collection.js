const collection = {
  state: {
    tuture: {},
    diff: [],
    pages: [],
    nowPage: {},
  }, // initial state
  reducers: {
    // handle stagetCollectionDatate changes with pure functions
    setCollectionData(state, payload) {
      const { tuture, diff } = payload;
      state.tuture = tuture;
      state.diff = diff;

      return state;
    },
  },
};

export default collection;
