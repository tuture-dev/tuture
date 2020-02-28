import { useState } from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Input } from 'antd';
import { useDispatch, useSelector, useStore } from 'react-redux';

import IconFont from './IconFont';
import { EDIT_ARTICLE } from '../utils/constants';

const noBorderAndShadow = css`
  border: none;

  &:hover {
    border: none;
    box-shadow: none;
  }

  &:active {
    border: none;
    box-shadow: none;
  }

  &:focus {
    border: none;
    box-shadow: none;
  }
`;

const { TextArea } = Input;

function PageHeader() {
  const store = useStore();
  const { nowArticleId } = useSelector((state) => state.collection);
  const { name = '', description = '' } = useSelector(
    store.select.collection.getArticleMetaById({ id: nowArticleId }),
  );
  const dispatch = useDispatch();
  const [timeoutHeaderState, setTimeoutHeaderState] = useState(null);
  const [timeoutDescriptionState, setTimeoutDescriptionState] = useState(null);

  function onToggleChildrenDrawer(e) {
    e.stopPropagation();

    dispatch.drawer.setChildrenVisible(true);
    dispatch.collection.setEditArticleId(nowArticleId);
    dispatch.drawer.setChildrenDrawerType(EDIT_ARTICLE);
  }

  function resetTimeout(id, newId) {
    clearTimeout(id);

    return newId;
  }

  function handleSaveCollection() {
    dispatch.collection.saveCollection();
  }

  function handleHeaderChange(e) {
    dispatch.collection.setArticleTitle(e.target.value);

    setTimeoutHeaderState(
      resetTimeout(timeoutHeaderState, setTimeout(handleSaveCollection, 1000)),
    );
  }

  function handleDescriptionChange(e) {
    dispatch({
      type: 'collection/setArticleDescription',
      payload: e.target.value,
    });

    setTimeoutDescriptionState(
      resetTimeout(
        timeoutDescriptionState,
        setTimeout(handleSaveCollection, 1000),
      ),
    );
  }

  return (
    <div
      css={css`
        border-bottom: 1px solid #e8e8e8;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        `}
      >
        <Input
          placeholder="无标题"
          value={name}
          onChange={handleHeaderChange}
          css={css`
            font-size: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(0, 0, 0, 1);
            line-height: 32px;
            padding: 0;
            max-width: 600px;

            ${noBorderAndShadow};
          `}
        />

        <span
          css={css`
            &:hover {
              color: #02b875;
              cursor: pointer;
            }
          `}
          onClick={onToggleChildrenDrawer}
        >
          <IconFont
            type="icon-moreread"
            css={css`
              width: 24px;
              height: 24px;
            `}
          />
        </span>
      </div>
      <TextArea
        placeholder="无描述"
        value={description}
        autoSize
        onChange={handleDescriptionChange}
        css={css`
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.65);
          line-height: 22px;
          margin-bottom: 16px;
          resize: none;
          padding: 0;

          ${noBorderAndShadow};
        `}
      />
    </div>
  );
}

export default PageHeader;
