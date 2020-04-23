export type LinkState = {
  isEditing: boolean;
  text: string;
  url: string;
};

const initialState: LinkState = {
  isEditing: false,
  text: '',
  url: '',
};

export const link = {
  state: initialState,
  reducers: {
    startEdit(state: LinkState) {
      state.isEditing = true;
      return state;
    },
    reset(state: LinkState) {
      state.isEditing = false;
      state.text = '';
      state.url = '';

      return state;
    },
    setText(state: LinkState, text: string) {
      state.text = text;
      return state;
    },
    setUrl(state: LinkState, url: string) {
      state.url = url;
      return state;
    },
  },
};
