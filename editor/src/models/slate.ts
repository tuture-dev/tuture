const slate = {
  state: {
    lang: '',
  },
  reducers: {
    setLang(state: any, payload: any) {
      state.lang = payload;

      return state;
    },
  },
};

export default slate;
