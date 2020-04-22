import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { message, Modal } from 'antd';
import omit from 'lodash.omit';
import { TocItem, TocStepItem, TocArticleItem } from '@tuture/local-server';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Dispatch, RootState } from 'store';

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

const { confirm } = Modal;

function ArticleStepListItem(props: {
  item: TocItem;
  onDelete: React.MouseEventHandler;
}) {
  const { item, onDelete } = props;
  const isItemOutdated = item.type === 'step' && item.outdated;
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
        if (item.type === 'step') {
          return;
        }
        toggleActiveArticle(item.id);
      }}
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
      {item.type === 'article' && (
        <Caret
          type={activeArticle === item.id ? 'caret-down' : 'caret-right'}
        />
      )}
      {isItemOutdated && <OutdatedTag />}
      <span
        css={css`
          width: ${isItemOutdated ? '390px' : '430px'};
          display: inline-block;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        `}
      >
        {item.name}
      </span>
      {item.type === 'step' && (
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

  const filteredArticleList = articleStepList.filter((item) => {
    return item.type === 'article' || activeArticle === item.articleId;
  });

  function handleInsertStep(step: TocStepItem, stepList: TocStepItem[]) {
    const insertIndex = stepList.findIndex(
      (stepItem) => stepItem.number > step.number,
    );

    if (insertIndex > -1) {
      return [
        ...stepList.slice(0, insertIndex),
        omit(step, ['articleId']),
        ...stepList.slice(insertIndex),
      ];
    } else {
      return stepList.concat(omit(step, ['articleId']) as TocStepItem);
    }
  }

  function handleArticleStepItemDelete(
    e: React.MouseEvent,
    articleStepItem: TocItem,
  ) {
    e.preventDefault();
    e.stopPropagation();

    if (articleStepItem.type === 'step') {
      const newArticleStepList = articleStepList.filter(
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

  function showDeleteConfirm(articleStepItem: TocArticleItem) {
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

  function deleteArticle(item: TocArticleItem) {
    const stepList = articleStepList.filter(
      (item) => item.type === 'step' && item.articleId === item.id,
    ) as TocStepItem[];
    const newUnassignedStepList = stepList.reduce(
      (unassignedStepList, currentStep) =>
        handleInsertStep(currentStep, unassignedStepList),
      unassignedStepList,
    );
    const newArticleStepList = articleStepList
      .filter((step) => step.type === 'step' && step.articleId !== item.id)
      .filter((step) => step.id !== item.id);

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
              key={item.id}
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
