import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Row, Col } from 'antd';
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
    <Row>
      <Col span={4}>
        <LastSavedTimestamp />
      </Col>
      <Col span={15} push={2}>
        <ToolBar />
      </Col>
      <Col span={5} push={2}>
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
      </Col>
    </Row>
  );
}

export default LayoutHeader;
