import React from 'react';
import { useSelector } from 'react-redux';
import { Spin } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { App } from '../components';

function Home() {
  const loading = useSelector(
    ({ loading }) =>
      loading.effects.collection.fetchCollection || loading.models.diff,
  );

  return (
    <div
      css={css`
        width: 100%;
      `}
    >
      <Spin tip="加载中..." spinning={loading}>
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

export default Home;
