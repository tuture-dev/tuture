import React from 'react';
import { message, notification } from 'antd';

const sync = {
  state: {
    syncVisible: false,
    remotes: null,
  },
  reducers: {
    setSyncVisible(state: any, payload: any) {
      state.syncVisible = payload;
    },
  },
  effects: (dispatch: any) => ({
    async sync(payload: any) {
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
    async fetchRemotes(payload: any, rootState: any) {
      const response = await fetch('/remotes');
      const body = await response.json();

      rootState.sync.remotes = body;
    },
  }),
};

export default sync;
