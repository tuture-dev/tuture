import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { Spin } from 'antd';

import { App } from '../components/';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { Dispatch, RootState } from '../store';

function Article() {
  const dispatch: Dispatch = useDispatch();
  const { fetchMeta, fetchArticles, fetchFragment } = useSelector(
    (state: RootState) => state.loading.effects.collection,
  );
  const loading = fetchMeta || fetchArticles || fetchFragment;

  const match = useRouteMatch('/articles/:id');
  const { id = '' }: any = match?.params;

  useEffect(() => {
    dispatch.collection.setNowArticle(id);
    dispatch.collection.fetchFragment();
  }, [dispatch, id]);

  return (
    <div>
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

export default Article;
