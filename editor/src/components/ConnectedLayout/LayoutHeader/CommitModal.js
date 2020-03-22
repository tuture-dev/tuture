import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Input } from 'antd';

import { NO_REMOTE_GITHUB } from '../../../utils/constants';

const CommitModal = () => {
  const [github, setGithub] = useState('');

  const dispatch = useDispatch();
  const syncResult = useSelector((state) => state.sync.syncResult);
  const loading = useSelector((state) => state.loading.effects.sync.sync);

  const handleChange = (e) => {
    setGithub(e.target.value);
  };

  const handleOk = () => {
    dispatch.sync.sync({ github, showMessage: true });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    dispatch.sync.setSyncResult('');
  };

  return (
    <Modal
      title="添加此项目的 Github 地址"
      visible={syncResult === NO_REMOTE_GITHUB}
      confirmLoading={loading}
      onOk={handleOk}
      onCancel={handleCancel}
      zIndex={1080}
    >
      <Input
        autoFocus
        value={github}
        placeholder="输入此仓库的远程 Github 地址"
        onChange={handleChange}
      />
    </Modal>
  );
};

export default CommitModal;
