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
    async sync(payload) {
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
          body: JSON.stringify({ github: payload?.github }),
        });

        if (response.ok) {
          if (payload?.showMessage) {
            message.success('同步内容成功！');
          }
        } else {
          this.setSyncStatus(false);
        }
      } catch (err) {
        if (payload?.showMessage) {
          message.success('同步内容失败');
        }

        this.setSyncStatus(false);
      }
    },
  },
};

export default sync;
