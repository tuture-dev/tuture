import { message } from 'antd';
import { timeout } from '../utils/commit';

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
  effects: (dispatch) => ({
    async commit(payload) {
      try {
        const response = await timeout(
          5000,
          fetch('/commit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              message: payload,
            }),
          }),
        );

        if (response.ok) {
          message.success('提交成功！');
        } else {
          message.error('提交失败！');
        }
      } catch (err) {
        message.error('提交超时');
      }

      dispatch.commit.reset();
    },
  }),
};

export default commit;
