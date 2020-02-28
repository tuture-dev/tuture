import { Spin } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

function Loading() {
  return (
    <div
      css={css`
        width: 100%;
      `}
    >
      <Spin tip="加载中...">
        <div
          css={css`
            height: calc(100vh - 64px);
            width: 100%;
          `}
        ></div>
      </Spin>
    </div>
  );
}

export default Loading;
