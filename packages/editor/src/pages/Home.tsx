import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { Dispatch, RootState } from 'store';
import { App } from '../components';

function Home() {
  const dispatch = useDispatch<Dispatch>();
  const { fetchMeta, fetchArticles, fetchFragment } = useSelector(
    (state: RootState) => state.loading.effects.collection,
  );
  const loading = fetchMeta || fetchArticles || fetchFragment;

  useEffect(() => {
    dispatch.collection.fetchFragment();
  }, [dispatch]);

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
