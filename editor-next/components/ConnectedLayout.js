import { useSelector, useDispatch } from 'react-redux';
import {
  Layout, Menu, Icon, Modal,
} from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import LayoutHeader from './LayoutHeader';
import DrawerComponent from './DrawerComponent';
import ChildrenDrawerComponent from './ChildrenDrawerComponent';
import {
  PAGE_CATAGUE,
  COLLECTION_CATALOGUE,
  COLLECTION_SETTING,
  CONTACT_US,
  NORMAL,
  COMMIT,
} from '../utils/constants';

const { Header, Sider, Content } = Layout;

function ConnectedLayout(props) {
  const { children } = props;
  const { commitStatus } = useSelector((state) => state.versionControl);
  const dispatch = useDispatch();

  function onToggleDrawer(toggleDrawerType) {
    dispatch.drawer.setDrawerType(toggleDrawerType);
  }

  function handleOk() {
    dispatch.versionControl.setCommitStatus(NORMAL);
  }

  function handleCancel() {
    dispatch.versionControl.setCommitStatus(NORMAL);
  }

  return (
    <div>
      <Layout>
        <Sider
          css={css`
            height: 100vh;
            background-color: #f7f7fa;
            z-index: 1000;
          `}
          breakpoint="lg"
          collapsed>
          <div
            className="logo"
            css={css`
              text-align: center;
              margin-top: 16px;
            `}>
            <img src="/images/logo.svg" alt="" />
          </div>
          <Menu
            css={css`
              background-color: #f7f7fa;
            `}
            theme="light"
            mode="inline"
            defaultSelectedKeys={['1']}>
            <Menu.Item
              key="1"
              title="页面目录"
              style={{ marginTop: '40px' }}
              onClick={() => onToggleDrawer(PAGE_CATAGUE)}>
              <Icon type="file" />
            </Menu.Item>
            <Menu.Item
              key="2"
              title="文集目录"
              style={{ marginTop: '40px' }}
              onClick={() => onToggleDrawer(COLLECTION_CATALOGUE)}>
              <Icon type="switcher" />
            </Menu.Item>
            <Menu.Item
              key="4"
              title="文集设置"
              style={{ marginTop: '40px' }}
              onClick={() => onToggleDrawer(COLLECTION_SETTING)}>
              <Icon type="setting" />
            </Menu.Item>
            <Menu.Item
              key="5"
              title="联系我们"
              style={{ marginTop: '40px' }}
              onClick={() => onToggleDrawer(CONTACT_US)}>
              <Icon type="contacts" />
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <DrawerComponent />
          <Header
            css={css`
              background-color: #fff;
              box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
              border: 1px solid rgba(232, 232, 232, 1);
            `}>
            <LayoutHeader />
          </Header>
          <Content
            css={css`
              background: #fff;
              display: flex;
              flex-direction: row;
            `}>
            <div
              css={css`
                width: 298px;
                height: calc(100vh - 64px);
              `}
            />
            <div
              css={css`
                overflow: hidden;
                position: relative;
                height: calc(100vh - 64px);
                width: calc(100% - 298px);
              `}>
              <ChildrenDrawerComponent />
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
      <Modal
        title="Basic Modal"
        visible={commitStatus === COMMIT}
        onOk={handleOk}
        onCancel={handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
}

export default ConnectedLayout;
