import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Drawer } from 'antd';

import { CREATE_ARTICLE, EDIT_ARTICLE } from 'utils/constants';

import CreateEditArticle from './CreateEditArticle';

const mapTypeToTitle = {
  [CREATE_ARTICLE]: '新建文章',
  [EDIT_ARTICLE]: '编辑文章',
};

function ChildrenDrawerComponent() {
  const dispatch = useDispatch();
  const { childrenDrawerType, childrenVisible } = useSelector(
    (state) => state.drawer,
  );

  function onClose() {
    dispatch({ type: 'drawer/setChildrenVisible', payload: false });
  }

  return (
    <Drawer
      title={mapTypeToTitle[childrenDrawerType]}
      placement="left"
      width={800}
      destroyOnClose
      onClose={onClose}
      visible={childrenVisible}
      zIndex={12}
      style={{ marginLeft: '80px' }}
    >
      <CreateEditArticle childrenDrawerType={childrenDrawerType} />
    </Drawer>
  );
}

export default ChildrenDrawerComponent;
