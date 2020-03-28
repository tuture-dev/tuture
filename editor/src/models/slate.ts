export type SlateState = {
  lang: string;
};

const initialState: SlateState = {
  lang: '',
};

export const slate = {
  state: initialState,
  reducers: {
    setLang(state: SlateState, lang: string) {
      state.lang = lang;

      return state;
    },
  },
};
