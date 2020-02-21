import React, { useMemo, useState } from 'react';

import { useSelector, useDispatch, useStore } from 'react-redux';
import { Layout, Menu, Icon, Modal } from 'antd';
import { useMediaQuery } from 'react-responsive';
import { Slate } from 'slate-react';
import logo from '../assets/images/logo.svg';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { updateLastSelection } from 'editure';
import LayoutHeader from './LayoutHeader';
import DrawerComponent from './DrawerComponent';
import {
  COLLECTION_CATALOGUE,
  COLLECTION_SETTING,
  CONTACT_US,
  NORMAL,
  COMMIT,
} from '../utils/constants';
import { initializeEditor } from '../utils/editor';
import { buttonRefs, ButtonRefsContext } from '../utils/hotkeys';
import PageCatalogue from './PageCatalogue';

const { Header, Sider, Content } = Layout;

const mapKeyToDrawerType = {
  '1': COLLECTION_CATALOGUE,
  '2': COLLECTION_SETTING,
  '3': CONTACT_US,
};

function ConnectedLayout(props) {
  const { children } = props;
  const { commitStatus } = useSelector((state) => state.versionControl);
  const { visible, drawerType, childrenVisible } = useSelector(
    (state) => state.drawer,
  );
  const [selectedKeys, setSelectedKeys] = useState([]);

  const store = useStore();
  const value = useSelector(store.select.collection.nowArticleContent);

  const dispatch = useDispatch();

  const isLgBreakPoint = useMediaQuery({ query: '(max-width: 992px)' });

  function handleOk() {
    dispatch({ type: 'versionControl/setCommitStatus', payload: NORMAL });
  }

  function handleCancel() {
    dispatch({ type: 'versionControl/setCommitStatus', payload: NORMAL });
  }

  function onContentChange(val) {
    dispatch({
      type: 'collection/setArticleContent',
      payload: { fragment: val },
    });
  }

  function oMenuClick({ key }) {
    const toggleDrawerType = mapKeyToDrawerType[key];

    if (!visible) {
      dispatch({ type: 'drawer/setVisible', payload: true });
      dispatch({ type: 'drawer/setDrawerType', payload: toggleDrawerType });

      setSelectedKeys([key]);
    } else {
      if (drawerType === toggleDrawerType) {
        dispatch({ type: 'drawer/setVisible', payload: false });

        setSelectedKeys([]);
      } else {
        dispatch({ type: 'drawer/setDrawerType', payload: toggleDrawerType });

        setSelectedKeys([key]);
      }
    }

    if (childrenVisible) {
      dispatch({ type: 'drawer/setChildrenVisible', payload: false });
    }
  }

  const editor = useMemo(initializeEditor, []);
  updateLastSelection(editor.selection);

  return (
    <ButtonRefsContext.Provider value={buttonRefs}>
      <Slate editor={editor} value={value} onChange={onContentChange}>
        <DrawerComponent />
        <Layout>
          <Sider
            css={css`
              height: 100vh;
              background-color: #f7f7fa;
              z-index: 1002;
            `}
            breakpoint="lg"
            collapsed
          >
            <div
              className="logo"
              css={css`
                text-align: center;
              `}
            >
              <img
                src={logo}
                alt=""
                css={css`
                  width: 24px;
                  height: 24px;
                `}
              />
            </div>
            <Menu
              css={css`
                background-color: #f7f7fa;
                border: none;
              `}
              theme="light"
              mode="inline"
              selectedKeys={selectedKeys}
              onClick={oMenuClick}
            >
              <Menu.Item key="1" title="文集目录" style={{ marginTop: '40px' }}>
                <Icon type="switcher" />
              </Menu.Item>
              <Menu.Item key="2" title="文集设置" style={{ marginTop: '40px' }}>
                <Icon type="setting" />
              </Menu.Item>
              <Menu.Item key="3" title="联系我们" style={{ marginTop: '40px' }}>
                <Icon type="contacts" />
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout
            css={css`
              display: flex;
              flex-direction: row;
            `}
          >
            <Layout
              css={css`
                width: 300px;
                height: 100vh;
                background-color: #f7f7fa;
                position: ${isLgBreakPoint ? 'absolute' : 'static'};
              `}
            >
              <PageCatalogue />
            </Layout>
            <Layout
              css={css`
                box-shadow: -10px 0 15px rgba(0, 0, 0, 0.04);
                width: ${isLgBreakPoint ? '100%' : '79%'};
                z-index: 1000;
              `}
            >
              <Header
                css={css`
                  background-color: #fff;
                  border-bottom: 1px solid rgba(232, 232, 232, 1);
                `}
              >
                <LayoutHeader />
              </Header>
              <Content
                css={css`
                  background: #fff;
                  display: flex;
                  flex-direction: row;
                `}
              >
                <div
                  css={css`
                    overflow: hidden;
                    position: relative;
                    height: calc(100vh - 64px);
                    width: 100%;
                  `}
                >
                  {children}
                </div>
              </Content>
            </Layout>
          </Layout>
        </Layout>
        <Modal
          title="Basic Modal"
          visible={commitStatus === COMMIT}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </Slate>
    </ButtonRefsContext.Provider>
  );
}

export default ConnectedLayout;
