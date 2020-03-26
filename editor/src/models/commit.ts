import { message } from 'antd';
import { timeout } from '../utils/commit';

const commit = {
  state: {
    isEditing: false,
    message: '',
  },
  reducers: {
    startEdit(state: any) {
      state.isEditing = true;
      return state;
    },
    reset(state: any) {
      state.isEditing = false;
      state.message = '';

      return state;
    },
    setMessage(state: any, payload: any) {
      state.message = payload;
      return state;
    },
  },
  effects: (dispatch: any) => ({
    async commit(payload: any) {
      try {
        const response: any = await timeout(
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
