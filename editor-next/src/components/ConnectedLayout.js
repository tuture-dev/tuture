import { useMemo, useEffect } from 'react';

import { useSelector, useDispatch, useStore } from 'react-redux';
import { Layout, Menu, Icon, Modal, Affix } from 'antd';
import { Slate } from 'slate-react';
import logo from '../assets/images/logo.svg';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { updateLastSelection } from 'editure';
import LayoutHeader from './LayoutHeader';
import DrawerComponent from './DrawerComponent';
import ChildrenDrawerComponent from './ChildrenDrawerComponent';
import {
  COLLECTION_CATALOGUE,
  COLLECTION_SETTING,
  CONTACT_US,
  NORMAL,
  COMMIT,
} from '../utils/constants';
import { initializeEditor } from '../utils/editor';
import { buttonRefs, ButtonRefsContext } from '../utils/hotkeys';

const { Header, Sider, Content } = Layout;

const mapKeyToDrawerType = {
  '1': COLLECTION_CATALOGUE,
  '2': COLLECTION_SETTING,
  '3': CONTACT_US,
};

function ConnectedLayout(props) {
  const { children } = props;
  const { commitStatus } = useSelector((state) => state.versionControl);
  const { visible, drawerType, childrenVisible, selectedKeys } = useSelector(
    (state) => state.drawer,
  );

  const store = useStore();
  const { name: pageTitle } = useSelector(
    store.select.collection.nowArticleMeta,
  );
  const value = useSelector(store.select.collection.nowArticleContent);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch.diff.fetchDiff();
    dispatch.collection.fetchCollection();
  }, [dispatch]);

  useEffect(() => {
    if (pageTitle) {
      document.title = pageTitle;
    }
  }, [pageTitle]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      dispatch.collection.saveCollection();
    }, 10000);
    return () => clearInterval(saveInterval);
  }, [dispatch]);

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

      dispatch({ type: 'drawer/setSelectedKeys', payload: [key] });
    } else {
      if (drawerType === toggleDrawerType) {
        dispatch({ type: 'drawer/setVisible', payload: false });

        dispatch({ type: 'drawer/setSelectedKeys', payload: [] });
      } else {
        dispatch({ type: 'drawer/setDrawerType', payload: toggleDrawerType });

        dispatch({ type: 'drawer/setSelectedKeys', payload: [key] });
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
        <Affix>
          <DrawerComponent />
        </Affix>
        <Affix>
          <ChildrenDrawerComponent />
        </Affix>
        <Layout>
          <Affix style={{ zIndex: 13 }}>
            <Sider
              width={100}
              css={css`
                height: 100vh;
                background-color: #f7f7fa;
                border-right: '1px solid #eee';
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
              `}
              collapsed
            >
              <div
                className="logo"
                css={css`
                  width: 100%;
                  text-align: center;
                  padding-top: 20px;
                `}
              >
                <img
                  src={logo}
                  alt=""
                  css={css`
                    width: 24px;
                    height: 24px;
                    margin: 0;
                    padding: 0;
                  `}
                />
              </div>
              <Menu
                css={css`
                  background-color: #f7f7fa;
                  border: none;
                  margin: auto;
                `}
                theme="light"
                mode="inline"
                selectedKeys={selectedKeys}
                onClick={oMenuClick}
              >
                <Menu.Item
                  key="1"
                  title="文集目录"
                  style={{ marginTop: '40px' }}
                >
                  <Icon type="switcher" />
                </Menu.Item>
                <Menu.Item
                  key="2"
                  title="文集设置"
                  style={{ marginTop: '40px' }}
                >
                  <Icon type="setting" />
                </Menu.Item>
                <Menu.Item
                  key="3"
                  title="联系我们"
                  style={{ marginTop: '40px' }}
                >
                  <Icon type="contacts" />
                </Menu.Item>
              </Menu>
            </Sider>
          </Affix>
          <Layout>
            <Affix>
              <Header
                css={css`
                  background-color: #fff;
                  padding: 0;
                  border-bottom: 1px solid rgba(232, 232, 232, 1);
                  min-width: 1200px;
                `}
              >
                <LayoutHeader />
              </Header>
            </Affix>
            <Content
              css={css`
                background: #fff;
                position: relative;
              `}
            >
              {children}
            </Content>
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
