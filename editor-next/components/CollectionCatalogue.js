import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { CREATE_ARTICLE, EDIT_ARTICLE } from '../utils/constants';

function CollectionCatalogue() {
  const { childrenVisible, childrenDrawerType } = useSelector(
    (state) => state.drawer,
  );
  const dispatch = useDispatch();

  function onToggleChildrenDrawer(toggleChildrenDrawerType) {
    if (childrenDrawerType === toggleChildrenDrawerType) {
      dispatch.drawer.setChildrenVisible(!childrenVisible);
    }

    if (!childrenVisible) {
      dispatch.drawer.setChildrenVisible(true);
    }

    dispatch.drawer.setChildrenDrawerType(toggleChildrenDrawerType);
  }

  return (
    <div>
      CollectionCatalogue
      <div
        css={css`
          margin-top: 40px;
        `}>
        <Button
          type="primary"
          css={css`
            margin-right: 20px;
          `}
          onClick={() => onToggleChildrenDrawer(EDIT_ARTICLE)}>
          编辑页面
        </Button>
        <Button
          type="primary"
          onClick={() => onToggleChildrenDrawer(CREATE_ARTICLE)}>
          创建新页
        </Button>
      </div>
    </div>
  );
}

export default CollectionCatalogue;
