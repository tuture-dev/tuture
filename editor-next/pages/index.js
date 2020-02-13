import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Drawer, Button,
} from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

function HomePage() {
  const { childrenVisible, visible } = useSelector((state) => state.drawer);
  const dispatch = useDispatch();

  function showDrawer() {
    dispatch.drawer.setChildrenVisible(true);
  }

  function onChildrenClose() {
    dispatch.drawer.setChildrenVisible(false);
  }

  return (
    <div
      css={css`
        width: ${visible ? 'calc(100% - 300px)' : '100%'};
      `}
    >
      <div
        css={css`
          height: calc(100vh - 64px);
          width: calc(100%-300px);
          overflow: hidden;
          position: relative;
        `}
      >
        Render in this
        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={showDrawer}>
            Open
          </Button>
        </div>
        <Drawer
          title="Basic Drawer"
          placement="left"
          closable={false}
          onClose={onChildrenClose}
          visible={childrenVisible}
          getContainer={false}
          style={{ position: 'absolute' }}
        >
          <p>Some contents...</p>
        </Drawer>
      </div>
    </div>
  );
}

export default HomePage;
