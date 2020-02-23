import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Row, Col } from 'antd';
import { useDispatch } from 'react-redux';

import ToolBar from './Toolbar';
import CommitModal from './CommitModal';
import LastSavedTimestamp from './LastSavedTimestamp';

function LayoutHeader() {
  const dispatch = useDispatch();

  function onCommitClick() {
    dispatch.commit.startEdit();
  }

  return (
    <Row>
      <Col span={4} push={1}>
        <LastSavedTimestamp />
      </Col>
      <Col span={15} push={2}>
        <ToolBar />
      </Col>
      <Col span={5} push={1}>
        <Button
          type="primary"
          css={css`
            margin-left: 20px;
          `}
          onClick={onCommitClick}
        >
          <CommitModal />
          提交
        </Button>
        <Button
          type="primary"
          css={css`
            margin-left: 20px;
          `}
        >
          同步
        </Button>
      </Col>
    </Row>
  );
}

export default LayoutHeader;
