const link = {
  state: {
    isEditing: false,
    text: '',
    url: '',
  },
  reducers: {
    startEdit(state: any) {
      state.isEditing = true;

      return state;
    },
    reset(state: any) {
      state.isEditing = false;
      state.text = '';
      state.url = '';

      return state;
    },
    setText(state: any, payload: any) {
      state.text = payload;

      return state;
    },
    setUrl(state: any, payload: any) {
      state.url = payload;

      return state;
    },
  },
};

export default link;
