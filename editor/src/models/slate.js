const slate = {
  state: {
    lang: '',
  },
  reducers: {
    setLang(state, payload) {
      state.lang = payload;

      return state;
    },
  },
};

export default slate;
