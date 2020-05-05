/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useSelector } from 'react-redux';
import { Spin } from 'antd';

import { RootState } from 'store';
import { Toc as TocComponent } from '../components';

function Toc() {
  const loading = useSelector(
    (state: RootState) => state.loading.effects.toc.fetchToc,
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
            overflow-y: auto;
            padding-bottom: 200px;
          `}
        >
          <TocComponent />
        </div>
      </Spin>
    </div>
  );
}

export default Toc;
