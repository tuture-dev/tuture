const tutorial = {
  state: {
    tuture: {},
    diff: [],
    pages: [],
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    setTutorialData(state, payload) {
      const { tuture, diff } = payload;
      state.tuture = tuture;
      state.diff = diff;

      return state;
    },
  },
};

export default tutorial;
