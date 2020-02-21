import React from 'react';
import { Spin } from 'antd';

import { App } from '../components/';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

function Article() {
  return (
    <div>
      <Spin tip="加载中..." spinning={false}>
        <div
          css={css`
            height: calc(100vh - 64px);
            width: 100%;
          `}
        >
          <App />
        </div>
      </Spin>
    </div>
  );
}

export default Article;
