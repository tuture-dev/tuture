/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button } from 'antd';

import ToolBar from './ToolBar';
import LastSavedTimestamp from './LastSavedTimestamp';

function LayoutHeader() {
  return (
    <div
      className="layout-header"
      css={css`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      `}>
      <ToolBar />
      <div
        css={css`
          display: flex;
          flex-direction: row;
          align-items: center;
        `}>
        <LastSavedTimestamp />
        <Button
          type="primary"
          css={css`
            margin-left: 20px;
          `}>
          提交
        </Button>
        <Button
          type="primary"
          css={css`
            margin-left: 20px;
          `}>
          发布
        </Button>
      </div>
    </div>
  );
}

export default LayoutHeader;
