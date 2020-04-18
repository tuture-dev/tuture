/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/core';
import { Button, Row, Col, Breadcrumb } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, Link } from 'react-router-dom';

import ToolBar from './Toolbar';
import SyncModal from './SyncModal';
import LastSavedTimestamp from './LastSavedTimestamp';

import { Dispatch, RootState } from 'store';

function LayoutHeader() {
  const dispatch = useDispatch<Dispatch>();
  const { collection } = useSelector((state: RootState) => state.collection);
  const { name = '' } = collection || {};

  const isSyncing = useSelector(
    (state: RootState) => state.loading.effects.sync.sync,
  );

  const isToc = useRouteMatch('/toc');

  function handleSaveToc() {
    dispatch.toc.save(true);
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
          <div>
            <Button
              type="primary"
              css={css`
                margin-left: 20px;
              `}
              onClick={() => dispatch.sync.setSyncVisible(true)}
              loading={isSyncing}
            >
              同步
            </Button>
            <SyncModal />
          </div>
        )}
      </Col>
    </Row>
  );
}

export default LayoutHeader;
