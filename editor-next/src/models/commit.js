const commit = {
  state: {
    isEditing: false,
    message: '',
  },
  reducers: {
    startEdit(state) {
      state.isEditing = true;
      return state;
    },
    reset(state) {
      state.isEditing = false;
      state.message = '';

      return state;
    },
    setMessage(state, payload) {
      state.message = payload;
      return state;
    },
  },
};

export default commit;
