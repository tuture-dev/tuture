import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';

import ToolBar from './Toolbar';
import LastSavedTimestamp from './LastSavedTimestamp';

import { COMMIT } from '../utils/constants';

function LayoutHeader() {
  const dispatch = useDispatch();

  function onCommitClick() {
    dispatch.versionControl.setCommitStatus(COMMIT);
  }

  return (
    <div
      className="layout-header"
      css={css`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      `}
    >
      <ToolBar />
      <div
        css={css`
          display: flex;
          flex-direction: row;
          align-items: center;
        `}
      >
        <LastSavedTimestamp />
        <Button
          type="primary"
          css={css`
            margin-left: 20px;
          `}
          onClick={onCommitClick}
        >
          提交
        </Button>
        <Button
          type="primary"
          css={css`
            margin-left: 20px;
          `}
        >
          发布
        </Button>
      </div>
    </div>
  );
}

export default LayoutHeader;
