import { message } from 'antd';

const sync = {
  state: {
    syncVisible: false,
  },
  reducers: {
    setSyncVisible(state, payload) {
      state.syncVisible = payload;
    },
  },
  effects: {
    async sync(payload, rootState) {
      try {
        const response = await fetch('/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            ...rootState.collection.collection,
            github: payload?.github,
          }),
        });

        if (response.ok) {
          if (payload?.showMessage) {
            message.success('同步内容成功！');
          }
        }

        this.setSyncStatus(false);
        this.setSyncResult('');
      } catch (err) {
        if (payload?.showMessage) {
          message.success('同步内容失败');
        }

        this.setSyncStatus(false);
        this.setSyncResult('');
      }
    },
  },
};

export default sync;
