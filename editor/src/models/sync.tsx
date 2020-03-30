import React from 'react';
import { message, notification } from 'antd';

import { Dispatch } from '../store';
import { Remote } from '../../../types';

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
      await dispatch.collection.saveCollection();

      try {
        const response = await fetch('/sync');

        if (response.ok) {
          if (payload?.showMessage) {
            message.success('同步内容成功！');
          }
        } else {
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
      } catch (err) {
        if (payload?.showMessage) {
          message.error('同步内容失败');
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
