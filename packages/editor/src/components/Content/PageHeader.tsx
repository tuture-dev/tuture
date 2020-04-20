import React, { useState } from 'react';
import { Article } from '@tuture/core';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Input } from 'antd';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { Dispatch, Store, RootState } from 'store';

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
  const store = useStore() as Store;
  const { nowArticleId } = useSelector((state: RootState) => state.collection);
  const { name = '', description = '' } =
    useSelector<RootState, Article | null>(
      store.select.collection.getArticleMetaById({ id: nowArticleId }),
    ) || {};
  const dispatch = useDispatch<Dispatch>();
  const [timeoutHeaderState, setTimeoutHeaderState] = useState<number | null>(
    null,
  );
  const [timeoutDescriptionState, setTimeoutDescriptionState] = useState<
    number | null
  >(null);

  function resetTimeout(id: number | null, newId: any) {
    if (id) {
      clearTimeout(id);
    }

    return newId;
  }

  function handleSaveCollection() {
    dispatch.collection.save();
  }

  function handleHeaderChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    dispatch.collection.setArticleById({
      props: { name: e.target.value },
    });

    setTimeoutHeaderState(
      resetTimeout(timeoutHeaderState, setTimeout(handleSaveCollection, 1000)),
    );
  }

  function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    dispatch.collection.setArticleById({
      props: { description: e.target.value },
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
          margin-bottom: 24px;
          position: relative;
        `}
      >
        <TextArea
          placeholder="无标题"
          value={name}
          onChange={handleHeaderChange}
          autoSize
          maxLength={128}
          rows={1}
          css={css`
            font-size: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(0, 0, 0, 1);
            line-height: 32px;
            padding: 0;
            resize: none;
            ${noBorderAndShadow};
          `}
        />
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
          line-height: 24px !important;
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
