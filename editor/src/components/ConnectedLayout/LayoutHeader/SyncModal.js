import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Checkbox, Row, Col, Tag, List, Typography } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { Text } = Typography;

const SyncItem = ({ name = '', refs = {} }) => {
  return (
    <Row
      css={css`
        width: 100%;
        text-align: center;
      `}
    >
      <Col
        span={2}
        css={css`
          padding: 16px 0;
        `}
      >
        <Checkbox value={name} />
      </Col>
      <Col
        span={4}
        css={css`
          padding: 16px 0;
        `}
      >
        <Text>{name}</Text>
      </Col>
      <Col
        span={18}
        css={css`
          padding: 4px 0;
        `}
      >
        <Row
          css={css`
            padding-bottom: 2px;
          `}
        >
          <Tag color="green">fetch</Tag>
          {refs.fetch}
        </Row>
        <Row>
          <Tag color="red">push</Tag>
          {refs.push}
        </Row>
      </Col>
    </Row>
  );
};

const ListHeader = () => (
  <Row
    css={css`
      width: 100%;
      text-align: center;
    `}
  >
    <Col span={2}></Col>
    <Col span={4}>远程名称</Col>
    <Col span={18}>远程 Git 地址</Col>
  </Row>
);

const CommitModal = () => {
  const syncVisible = useSelector((state) => state.sync.syncVisible);
  const remotes =
    useSelector((state) => state.collection?.collection?.remotes) || [];
  const allRemotes = useSelector((state) => state.sync.remotes) || [];

  const remoteNames = remotes.map(({ name }) => name);
  const [checkedRemotes, setCheckedRemotes] = useState(remoteNames);

  const dispatch = useDispatch();

  useEffect(() => {
    if (syncVisible) {
      dispatch.sync.fetchRemotes();
    }
  }, [syncVisible]);

  useEffect(() => {
    if (remoteNames.length > 0 && checkedRemotes.length === 0) {
      setCheckedRemotes(remoteNames);
    }
  }, [remoteNames, checkedRemotes]);

  const handleChange = (checkedValues) => {
    setCheckedRemotes(checkedValues);
  };

  const handleOk = () => {
    dispatch.collection.setRemotes(
      allRemotes.filter(({ name }) => checkedRemotes.includes(name)),
    );
    dispatch.sync.sync({ showMessage: true });
    dispatch.sync.setSyncVisible(false);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    dispatch.sync.setSyncVisible(false);
  };

  return (
    <Modal
      title="选择需要同步的远程 Git 仓库"
      visible={syncVisible}
      destroyOnClose
      onOk={handleOk}
      cancelText="取消"
      okText="同步"
      onCancel={handleCancel}
      zIndex={1080}
    >
      <Checkbox.Group
        style={{ width: '100%' }}
        defaultValue={checkedRemotes}
        value={checkedRemotes}
        onChange={handleChange}
      >
        <List
          header={<ListHeader />}
          dataSource={allRemotes}
          renderItem={(item) => (
            <List.Item
              css={css`
                transition: background-color 0.5s;

                &:hover {
                  background-color: #eee;
                }
              `}
            >
              <SyncItem {...item} />
            </List.Item>
          )}
        />
      </Checkbox.Group>
    </Modal>
  );
};

export default CommitModal;
