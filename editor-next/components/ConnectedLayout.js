import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Icon, Drawer, Button } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { Header, Sider, Content } = Layout;

function ConnectedLayout(props) {
  const { visible } = useSelector((state) => state.drawer);
  const dispatch = useDispatch();

  function onClose() {
    dispatch.drawer.setVisible(false);
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
          collapsed
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}>
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
              style={{ marginTop: '40px' }}
              onClick={() => dispatch.drawer.setVisible(!visible)}>
              <Icon type="file" />
            </Menu.Item>
            <Menu.Item key="2" style={{ marginTop: '40px' }}>
              <Icon type="switcher" />
            </Menu.Item>
            <Menu.Item key="3" style={{ marginTop: '40px' }}>
              <Icon type="branches" />
            </Menu.Item>
            <Menu.Item key="4" style={{ marginTop: '40px' }}>
              <Icon type="setting" />
            </Menu.Item>
            <Menu.Item key="5" style={{ marginTop: '40px' }}>
              <Icon type="contacts" />
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Drawer
            title="Basic Drawer"
            placement="left"
            width={300}
            mask={false}
            closable={false}
            onClose={onClose}
            visible={visible}
            getContainer={false}
            style={{
              position: 'absolute',
              zIndex: 100,
              borderRight: '1px solid #E8E8E8',
            }}>
            <div>
              <p>Some contents...</p>
              <Button onClick={() => dispatch.drawer.setChildrenVisible(true)}>
                修改信息
              </Button>
            </div>
          </Drawer>
          <Header
            css={css`
              background-color: #fff;
              box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
              border: 1px solid rgba(232, 232, 232, 1);
            `}>
            Header
            <Button
              css={css`
                margin-left: 200px;
              `}>
              hello
            </Button>
          </Header>
          <Content
            css={css`
              background: #fff;
              display: flex;
              flex-direction: row;
            `}>
            {visible && (
              <div
                css={css`
                  height: calc(100vh - 64px);
                  width: 300px;
                `}>
                hello tuture
              </div>
            )}
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default ConnectedLayout;
