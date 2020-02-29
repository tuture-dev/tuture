const link = {
  state: {
    isEditing: false,
    text: '',
    url: '',
  },
  reducers: {
    startEdit(state) {
      state.isEditing = true;

      return state;
    },
    reset(state) {
      state.isEditing = false;
      state.text = '';
      state.url = '';

      return state;
    },
    setText(state, payload) {
      state.text = payload;

      return state;
    },
    setUrl(state, payload) {
      state.url = payload;

      return state;
    },
  },
};

export default link;
