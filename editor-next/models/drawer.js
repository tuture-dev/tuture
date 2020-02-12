const drawer = {
  state: {
    childrenVisible: false,
    visible: false,
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    setChildrenVisible(state, payload) {
      state.childrenVisible = payload;
      return state;
    },
    setVisible(state, payload) {
      state.visible = payload;

      return state;
    },
  },
};

export default drawer;
