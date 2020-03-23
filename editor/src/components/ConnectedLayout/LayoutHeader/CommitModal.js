import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Checkbox, Row, Col, Tabs, List, Typography } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { TabPane } = Tabs;
const { Text } = Typography;

const SyncItem = ({ name = '', refs = {} }) => {
  return (
    <Row
      css={css`
        width: 100%;
      `}
    >
      <Col span={2}>
        <Checkbox lable={refs.push} value={refs.push} />
      </Col>
      <Col span={6}>
        <Text>{name}</Text>
      </Col>
      <Col span={16}>
        <Tabs renderTabBar={renderTabBar}>
          <TabPane tab="fetch" key="1">
            <Text>{refs.fetch}</Text>
          </TabPane>
          <TabPane tab="push" key="2">
            <Text>{refs.push}</Text>
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  );
};

const renderTabBar = (props, DefaultTabBar) => (
  <DefaultTabBar
    {...props}
    css={css`
      & .ant-tabs-tab {
        padding: 0 4px 4px;
      }
    `}
  />
);

const ListHeader = () => (
  <Row>
    <Col span={2}></Col>
    <Col span={6}>远程分支名</Col>
    <Col span={16}>远程 Git 地址</Col>
  </Row>
);

const CommitModal = () => {
  const [timeoutState, setTimeoutState] = useState(null);
  const syncVisible = useSelector((state) => state.sync.syncVisible);
  const remotes =
    useSelector((state) => state.collection?.collection?.remotes) || [];

  const [checkedRemotes, setCheckedRemotes] = useState([]);

  const dispatch = useDispatch();

  const loading = useSelector((state) => state.loading.effects.sync.sync);

  const handleChange = (value) => {
    setCheckedRemotes(value);
  };

  function resetTimeout(id, newId) {
    clearTimeout(id);

    return newId;
  }

  const handleOk = () => {
    dispatch.sync.sync({ checkedRemotes, showMessage: true });

    setTimeoutState(
      resetTimeout(
        timeoutState,
        setTimeout(() => {
          dispatch.collection.saveCollection();
        }, 1000),
      ),
    );
  };

  const handleCancel = (e) => {
    e.preventDefault();
    dispatch.sync.setSync('');
  };

  return (
    <Modal
      title="选择待同步的远程 Git 地址"
      visible={syncVisible}
      confirmLoading={loading}
      destroyOnClose
      onOk={handleOk}
      cancelText="取消"
      okText={loading ? '同步中...' : '同步'}
      onCancel={handleCancel}
      zIndex={1080}
    >
      <Checkbox.Group
        style={{ width: '100%' }}
        value={checkedRemotes}
        onChange={handleChange}
      >
        <List
          header={<ListHeader />}
          dataSource={remotes}
          renderItem={(item) => (
            <List.Item>
              <SyncItem {...item} />
            </List.Item>
          )}
        />
      </Checkbox.Group>
    </Modal>
  );
};

export default CommitModal;
