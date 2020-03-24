import { message } from 'antd';

const sync = {
  state: {
    syncVisible: false,
    remotes: null,
  },
  reducers: {
    setSyncVisible(state, payload) {
      state.syncVisible = payload;
    },
  },
  effects: (dispatch) => ({
    async sync(payload) {
      await dispatch.collection.saveCollection();

      try {
        const response = await fetch('/sync');

        if (response.ok) {
          if (payload?.showMessage) {
            message.success('同步内容成功！');
          }
        }
      } catch (err) {
        if (payload?.showMessage) {
          message.error('同步内容失败');
        }
      }
    },
    async fetchRemotes(payload, rootState) {
      const response = await fetch('/remotes');
      const body = await response.json();

      rootState.sync.remotes = body;
    },
  }),
};

export default sync;
