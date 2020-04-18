import { message } from 'antd';

import { Dispatch } from '../store';
import { timeout } from '../utils/commit';

export type CommitState = {
  isEditing: boolean;
  message: string;
};

const initialState: CommitState = {
  isEditing: false,
  message: '',
};

export const commit = {
  state: initialState,
  reducers: {
    startEdit(state: CommitState) {
      state.isEditing = true;
      return state;
    },
    reset(state: CommitState) {
      state.isEditing = false;
      state.message = '';

      return state;
    },
    setMessage(state: CommitState, message: string) {
      state.message = message;
      return state;
    },
  },
  effects: (dispatch: Dispatch) => ({
    async commit(payload: string) {
      try {
        const response = await timeout<Response>(
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
