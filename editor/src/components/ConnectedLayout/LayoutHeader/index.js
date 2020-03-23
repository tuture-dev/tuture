import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Row, Col, Breadcrumb } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, Link } from 'react-router-dom';

import ToolBar from './Toolbar';
import CommitModal from './CommitModal';
import LastSavedTimestamp from './LastSavedTimestamp';

function LayoutHeader() {
  const dispatch = useDispatch();
  const { name = '' } =
    useSelector((state) => state.collection.collection) || {};

  const isToc = useRouteMatch('/toc');

  function handleSaveToc() {
    dispatch.toc.setSaveStatus(true);
  }

  return (
    <Row type="flex" align="middle">
      <Col span={isToc ? 10 : 4} push={isToc ? 0 : 1}>
        {isToc ? (
          <Breadcrumb
            css={css`
              margin-left: 32px;
            `}
          >
            <Breadcrumb.Item>
              <Link to="/">{name}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>文集目录</Breadcrumb.Item>
          </Breadcrumb>
        ) : (
          <LastSavedTimestamp />
        )}
      </Col>
      <Col span={isToc ? 9 : 15} push={2}>
        {!isToc && <ToolBar />}
      </Col>
      <Col span={5} push={isToc ? 3 : 1}>
        {isToc ? (
          <Button type="primary" onClick={handleSaveToc}>
            保存
          </Button>
        ) : (
          <>
            <Button
              type="primary"
              css={css`
                margin-left: 20px;
              `}
              onClick={() => dispatch.sync.setSyncVisible(true)}
            >
              同步
            </Button>
            <CommitModal />
          </>
        )}
      </Col>
    </Row>
  );
}

export default LayoutHeader;
