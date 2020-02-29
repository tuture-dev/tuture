import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { Spin } from 'antd';

import { App } from '../components/';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

function Article() {
  const dispatch = useDispatch();
  const loading = useSelector(
    ({ loading }) =>
      loading.effects.collection.fetchCollection || loading.models.diff,
  );
  const match = useRouteMatch('/articles/:id');
  const { id = '' } = match?.params;

  useEffect(() => {
    dispatch.collection.setNowArticle(id);
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
