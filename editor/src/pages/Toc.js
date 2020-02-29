/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useSelector } from 'react-redux';
import { Spin } from 'antd';

import { Toc as TocComponent } from '../components/';

function Toc() {
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
            background: #f7f7fa;
            padding-top: 24px;
          `}
        >
          <TocComponent />
        </div>
      </Spin>
    </div>
  );
}

export default Toc;
