import { useDispatch, useSelector } from 'react-redux';
import { Layout, Menu, Icon } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { Header, Sider, Content } = Layout;

function ConnectedLayout(props) {
  return (
    <div>
      <Layout>
        <Sider
          css={css`
            height: 100vh;
            background-color: #f7f7fa;
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
            defaultSelectedKeys={['4']}>
            <Menu.Item key="1" style={{ marginTop: '40px' }}>
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
          <Header
            css={css`
              background-color: rgba(255, 255, 255, 1);
              box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
              border: 1px solid rgba(232, 232, 232, 1);
            `}>
            Header
          </Header>
          <Content
            css={css`
              background: #fff;
            `}>
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default ConnectedLayout;
