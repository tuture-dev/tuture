import React, { useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { message, Modal } from 'antd';
import classnames from 'classnames';
import omit from 'lodash.omit';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Dispatch, RootState, Store } from 'store';

import {
  headerStyle,
  assistInfoStyle,
  containerStyle,
  listItemActionStyle,
  listItemStyle,
  activeListItemStyle,
} from './styles';
import Caret from './widgets/Caret';
import OutdatedTag from './widgets/OutdatedTag';
import DeleteButton from './widgets/DeleteButton';
import { TocArticleItem, TocStepItem } from 'types';

const { confirm } = Modal;

function ArticleStepListItem(props: {
  item: TocStepItem;
  onDelete: React.MouseEventHandler;
}) {
  const { item, onDelete } = props;
  const dispatch: Dispatch = useDispatch();
  const { activeArticle } = useSelector((state: RootState) => state.toc);

  function toggleActiveArticle(articleId: string) {
    if (activeArticle === articleId) {
      dispatch.toc.setActiveArticle('');
    } else {
      dispatch.toc.setActiveArticle(articleId);
    }
  }

  return (
    <li
      key={item.id}
      onClick={() => {
        if (item.articleId) {
          return;
        }
        toggleActiveArticle(item.id);
      }}
      className={classnames({
        [`list-item-${item.articleId}`]: item.articleId,
      })}
      css={css`
        ${listItemStyle}
        height: 40px;
        padding-left: 32px;
        margin-left: ${item.level * 24}px;

        &:hover .list-item-tail {
          display: none;
        }

        &:hover .list-item-action {
          display: inline-block;
        }

        ${activeArticle === item.id && activeListItemStyle}
      `}
    >
      {!item.articleId && (
        <Caret
          type={activeArticle === item.id ? 'caret-down' : 'caret-right'}
        />
      )}
      {item.outdated && <OutdatedTag />}
      <span
        css={css`
          width: ${item.outdated ? '390px' : '430px'};
          display: inline-block;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        `}
      >
        {item.name}
      </span>
      {item.articleId && (
        <span
          className="list-item-tail"
          css={css`
            ${listItemActionStyle}
          `}
        >
          步骤
        </span>
      )}

      <span
        className="list-item-action"
        css={css`
          ${listItemActionStyle}
          display: none;
        `}
      >
        <DeleteButton onClick={onDelete} />
      </span>
    </li>
  );
}

function ArticleStepList() {
  const dispatch: Dispatch = useDispatch();

  const {
    unassignedStepList = [],
    articleStepList = [],
    activeArticle,
  } = useSelector((state: RootState) => state.toc);

  useEffect(() => {
    dispatch.collection.getArticleStepList();
  }, [dispatch.collection]);

  const filteredArticleList =
    (articleStepList || []).filter((articleStep) => {
      return !articleStep?.articleId || activeArticle === articleStep.articleId;
    }) || [];

  function handleInsertStep(step: TocStepItem, stepList: TocStepItem[]) {
    const insertIndex = stepList.findIndex(
      (stepItem) => stepItem.number > step.number,
    );

    if (insertIndex > -1) {
      const newStepList = [
        ...stepList.slice(0, insertIndex),
        omit(step, ['articleId']),
        ...stepList.slice(insertIndex),
      ];

      return newStepList;
    } else {
      const newStepList = stepList.concat(
        omit(step, ['articleId']) as TocStepItem,
      );

      return newStepList;
    }
  }

  function handleArticleStepItemDelete(
    e: React.MouseEvent,
    articleStepItem: TocStepItem,
  ) {
    e.preventDefault();
    e.stopPropagation();

    if (articleStepItem?.articleId) {
      const newArticleStepList = (articleStepList || [])?.filter(
        (articleStep) => articleStep.id !== articleStepItem.id,
      );

      dispatch.toc.setArticleStepList(newArticleStepList);

      const newUnassignedStepList = handleInsertStep(
        articleStepItem,
        unassignedStepList,
      );

      dispatch.toc.setUnassignedStepList(newUnassignedStepList);

      message.success('释放步骤成功');
    } else {
      showDeleteConfirm(articleStepItem);
    }
  }

  function showDeleteConfirm(articleStepItem: TocStepItem) {
    confirm({
      title: `确定删除文章 ${articleStepItem.name}？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        deleteArticle(articleStepItem);
      },
    });
  }

  function deleteArticle(articleStepItem: TocStepItem) {
    const stepList = articleStepList?.filter(
      (step) => step?.articleId === articleStepItem.id,
    );
    const newUnassignedStepList = stepList?.reduce(
      (unassignedStepList, currentStep) =>
        handleInsertStep(currentStep, unassignedStepList),
      unassignedStepList,
    );
    const newArticleStepList = articleStepList
      ?.filter((step) => step?.articleId !== articleStepItem.id)
      .filter((step) => step.id !== articleStepItem.id);

    dispatch.toc.setUnassignedStepList(newUnassignedStepList);
    dispatch.toc.setArticleStepList(newArticleStepList);
    dispatch.toc.setActiveArticle('');

    message.success('删除文章成功');
  }

  return (
    <div
      className="menu-wrapper page-list"
      css={css`
        ${containerStyle}
        padding-left: 56px;
        padding-right: 56px;
      `}
    >
      <div className="menu-header" css={headerStyle}>
        <h1
          css={css`
            font-size: 30px;
          `}
        >
          文集目录
        </h1>
        <p css={assistInfoStyle}>选择文章，点击添加或拖拽左边的步骤进行分配</p>
      </div>
      <div className="menu-body">
        <ul
          className="step-list"
          css={css`
            list-style: none;
            padding: 0;
            margin: 0;
            margin-top: 16px;
          `}
        >
          {filteredArticleList.map((item) => (
            <ArticleStepListItem
              item={item}
              onDelete={(e) => handleArticleStepItemDelete(e, item)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ArticleStepList;
