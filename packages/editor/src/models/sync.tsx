import React from 'react';
import { message, notification } from 'antd';
import axios from 'axios';
import { Remote } from '@tuture/core';

import { Dispatch } from '../store';

export type SyncState = {
  syncVisible: boolean;
  remotes: Remote[];
};

const initialState: SyncState = {
  syncVisible: false,
  remotes: [],
};

export const sync = {
  state: initialState,
  reducers: {
    setSyncVisible(state: SyncState, visible: boolean) {
      state.syncVisible = visible;
    },
    setRemotes(state: SyncState, remotes: Remote[]) {
      state.remotes = remotes;
    },
  },
  effects: (dispatch: Dispatch) => ({
    async sync(payload: { showMessage: boolean }) {
      await dispatch.collection.save();

      try {
        const response = await axios.get('/sync');

        if (response.status === 200) {
          if (payload?.showMessage) {
            message.success('同步内容成功！');
          }
        }
      } catch (err) {
        if (payload?.showMessage) {
          if (payload?.showMessage) {
            notification.error({
              message: '内容同步可能发生了文件冲突',
              description: (
                <div>
                  <p>请检查代码仓库是否存在冲突文件，并通过以下流程解决：</p>
                  <p>1）打开发生冲突的文件，解决冲突；</p>
                  <p>2）将冲突的文件添加到暂存区；</p>
                  <p>
                    3）运行 <code>tuture sync --continue</code> 继续同步。
                  </p>
                </div>
              ),
              duration: null,
            });
          }
        }
      }
    },
    async fetchRemotes() {
      const response = await fetch('/remotes');
      const body = await response.json();

      dispatch.sync.setRemotes(body as Remote[]);
    },
  }),
};
