import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Input } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const CommitModal = () => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.commit.message);
  const isEditing = useSelector((state) => state.commit.isEditing);
  const loading = useSelector((state) => state.loading.effects.commit.commit);
  const placeholder = `提交于 ${new Date()}`;

  const handleChange = (e) => {
    dispatch.commit.setMessage(e.target.value);
  };

  const handleOk = () => {
    if (!message) {
      dispatch.commit.setMessage(placeholder);
    }

    dispatch.commit.commit(message);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    dispatch.commit.reset();
  };

  return (
    <Modal
      title="提交"
      visible={isEditing}
      confirmLoading={loading}
      onOk={handleOk}
      onCancel={handleCancel}
      zIndex={1080}
    >
      <p
        css={css`
          margin-top: 8px;
          margin-bottom: 8px;
        `}
      >
        提交信息
      </p>
      <Input
        autoFocus
        value={message}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </Modal>
  );
};

export default CommitModal;
