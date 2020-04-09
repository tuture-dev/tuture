import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { message, Tooltip, Tag, Modal, Icon } from 'antd';
import classnames from 'classnames';
import omit from 'lodash.omit';

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
import IconFont from '../../components/IconFont';
import { Step } from '../../../../types';
import { TocItem, TocStepItem, TocArticleItem } from 'types';

const { confirm } = Modal;

function ArticleStepList() {
  const store: any = useStore();
  const dispatch: Dispatch = useDispatch();

  const defaultArticleStepList: TocArticleItem[] = useSelector(
    store.select.collection.getArticleStepList,
  );
  const unassignedStepList: TocStepItem[] = useSelector(
    (state: RootState) => state.toc.unassignedStepList,
  );
  const articleStepList = useSelector(
    (state: RootState) => state.toc.articleStepList,
  );
  const activeArticle = useSelector(
    (state: RootState) => state.toc.activeArticle,
  );

  useEffect(() => {
    if (defaultArticleStepList && !articleStepList.length) {
      dispatch.toc.setArticleStepList(defaultArticleStepList);
    }
  }, [articleStepList.length, defaultArticleStepList, dispatch.toc]);

  const filteredArticleList = (articleStepList as TocArticleItem[]).filter(
    (articleStep: any) => {
      if (!articleStep?.articleId) {
        return true;
      }

      if (activeArticle === articleStep.articleId) {
        return true;
      }

      return false;
    },
  );

  function toggleActiveArticle(articleId: string) {
    if (activeArticle === articleId) {
      dispatch.toc.setActiveArticle('');
    } else {
      dispatch.toc.setActiveArticle(articleId);
    }
  }

  function showDeleteConfirm(articleStepItem: any) {
    confirm({
      title: `确定删除文章 ${articleStepItem.name}？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        handleDeleteArticle(articleStepItem);
      },
    });
  }

  function handleInsertStep(step: Step, stepList: TocItem[]) {
    const insertIndex = stepList.findIndex(
      (stepItem: any) => stepItem.number > step.number,
    );

    if (insertIndex > -1) {
      const newStepList = [
        ...stepList.slice(0, insertIndex),
        omit(step, ['articleId']),
        ...stepList.slice(insertIndex),
      ];

      return newStepList;
    } else {
      const newStepList = stepList.concat(omit(step, ['articleId']) as TocItem);

      return newStepList;
    }
  }

  function handleArticleStepClick(e: any, articleStepItem: any) {
    e.preventDefault();
    e.stopPropagation();

    if (articleStepItem?.articleId) {
      const newArticleStepList = articleStepList.filter(
        (articleStep: any) => articleStep.id !== articleStepItem.id,
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

  function handleDeleteArticle(articleStepItem: any) {
    const stepList = articleStepList.filter(
      (step: any) => step?.articleId === articleStepItem.id,
    );
    const newUnassignedStepList = stepList.reduce(
      (unassignedStepList: any, currentStep: any) =>
        handleInsertStep(currentStep, unassignedStepList),
      unassignedStepList,
    );
    const newArticleStepList = articleStepList
      .filter((step: any) => step?.articleId !== articleStepItem.id)
      .filter((step: any) => step.id !== articleStepItem.id);

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
          {filteredArticleList.map((item: any) => (
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

                &:hover .list-item-action {
                  visibility: visible;
                }

                margin-left: ${item.level * 24}px;

                &:hover {
                  cursor: pointer;
                }

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
                <span
                  css={css`
                    position: absolute;
                    margin-left: -20px;
                    margin-top: -2px;
                  `}
                >
                  <Icon
                    type={
                      activeArticle === item.id ? 'caret-down' : 'caret-right'
                    }
                    css={css`
                      & > svg {
                        width: 10px;
                        height: 10px;
                      }
                    `}
                  />
                </span>
              )}
              {item.outdated && (
                <Tooltip title="点击查看什么是过时步骤">
                  <Tag
                    css={css`
                      color: #fa8c16;
                      background: #fff7e6;
                      border-color: #ffd591;

                      &:hover {
                        cursor: pointer;
                      }
                    `}
                  >
                    <a
                      href="https://docs.tuture.co/reference/tuture-yml-spec.html#outdated"
                      target="_blank"
                      rel="noopener noreferrer"
                      css={css`
                        color: #fa8c16 !important;
                      `}
                    >
                      过时
                    </a>
                  </Tag>
                </Tooltip>
              )}
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
                <IconFont
                  type="icon-delete1"
                  onClick={(e) => handleArticleStepClick(e, item)}
                  css={css`
                    color: #8c8c8c;

                    &:hover {
                      color: #595959;
                      cursor: pointer;
                    }

                    & > svg {
                      width: 12px;
                      height: 12px;
                    }
                  `}
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ArticleStepList;
