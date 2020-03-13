import { Layout, Menu, Icon } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import logo from 'assets/images/logo.svg';
import {
  COLLECTION_CATALOGUE,
  COLLECTION_SETTING,
  CONTACT_US,
} from 'utils/constants';

const { Sider } = Layout;

const mapKeyToDrawerType = {
  '1': COLLECTION_CATALOGUE,
  '3': COLLECTION_SETTING,
  '4': CONTACT_US,
};

function MainMenu() {
  const dispatch = useDispatch();
  const { visible, drawerType, childrenVisible, selectedKeys } = useSelector(
    (state) => state.drawer,
  );
  const history = useHistory();

  function onMenuClick({ key }) {
    if (key === '2') {
      dispatch({ type: 'drawer/setVisible', payload: false });
      dispatch({ type: 'drawer/setSelectedKeys', payload: [key] });
      history.push('/toc');

      return;
    }

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

  return (
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
        onClick={onMenuClick}
      >
        <Menu.Item key="1" title="文集目录" style={{ marginTop: '40px' }}>
          <Icon type="switcher" />
        </Menu.Item>
        <Menu.Item key="2" title="目录编排" style={{ marginTop: '40px' }}>
          <Icon type="profile" />
        </Menu.Item>
        <Menu.Item key="3" title="文集设置" style={{ marginTop: '40px' }}>
          <Icon type="setting" />
        </Menu.Item>
        <Menu.Item key="4" title="联系我们" style={{ marginTop: '40px' }}>
          <Icon type="contacts" />
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default MainMenu;
