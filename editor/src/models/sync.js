import { message } from 'antd';

import { NO_REMOTE_GITHUB } from '../utils/constants';

const sync = {
  state: {
    isSync: false,
    syncResult: '',
  },
  reducers: {
    setSyncStatus(state, payload) {
      state.isSync = payload;
    },
    setSyncResult(state, payload) {
      state.syncResult = payload;
    },
  },
  effects: {
    async sync(payload, rootState) {
      this.setSyncStatus(true);

      if (!payload?.github) {
        this.setSyncResult(NO_REMOTE_GITHUB);
        this.setSyncStatus(false);

        return;
      }

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
