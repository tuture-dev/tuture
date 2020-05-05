import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Divider, Tooltip } from 'antd';
import { Link, useHistory } from 'react-router-dom';

/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';

import IconFont from 'components/IconFont';
import { Dispatch, RootState } from 'store';
import { EDIT_ARTICLE, CREATE_ARTICLE } from 'utils/constants';

const listStyle = css`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`;

const listItemStyle = css`
  height: 37px;
  line-height: 37px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 24px;
  padding-right: 24px;
  margin-bottom: 8px;
  transition: background 0.3s;

  &:hover {
    background: #fff;
    cursor: pointer;
  }
`;

const itemTitleStyle = css`
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
`;

function CollectionCatalogue() {
  const { childrenVisible, childrenDrawerType } = useSelector(
    (state: RootState) => state.drawer,
  );
  const [selectItem, setSelectItem] = useState('');
  const history = useHistory();

  const dispatch = useDispatch<Dispatch>();
  const { articles } = useSelector((state: RootState) => state.collection);

  function onToggleChildrenDrawer(
    e: React.MouseEvent,
    toggleChildrenDrawerType: string,
    articleId?: string,
  ) {
    e.stopPropagation();
    if (childrenDrawerType === toggleChildrenDrawerType) {
      dispatch.drawer.setChildrenVisible(!childrenVisible);
    }

    if (!childrenVisible) {
      dispatch.drawer.setChildrenVisible(true);
    }

    if (toggleChildrenDrawerType === EDIT_ARTICLE && articleId) {
      dispatch.collection.setEditArticleId(articleId);
    }

    dispatch.drawer.setChildrenDrawerType(toggleChildrenDrawerType);
  }

  function onCatalogueItemClick(articleId: string) {
    dispatch.drawer.setVisible(false);
    setSelectItem(articleId);

    history.push(`/articles/${articleId}`);
  }

  return (
    <div>
      <div>
        <ul className="catalogue" css={listStyle}>
          {articles.map((article) => (
            <li
              className="catalogue-item"
              key={article.id}
              id={article.id}
              onClick={() => onCatalogueItemClick(article.id)}
              css={css`
                ${listItemStyle}

                background: ${
                  selectItem === article.id ? '#FFF' : 'transparent'
                };

                &:hover > span {
                  visibility: visible;
                }
              `}
            >
              <span css={itemTitleStyle}>
                <Tooltip
                  title={article.name}
                  placement="right"
                  mouseEnterDelay={0.5}
                >
                  <span
                    css={css`
                      display: inline-block;
                      max-width: 224px;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                    `}
                  >
                    {article.name}
                  </span>
                </Tooltip>
              </span>
              <span
                css={css`
                  &:hover {
                    color: #02b875;
                  }
                `}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleChildrenDrawer(e, EDIT_ARTICLE, article.id);
                }}
              >
                <IconFont type="icon-moreread" />
              </span>
            </li>
          ))}
        </ul>
        <Divider
          css={css`
            width: 252px;
            margin-left: 24px;
            min-width: 252px;
          `}
        />
        <ul css={listStyle}>
          <li
            css={css`
              ${listItemStyle}

              &:hover {
                background: #fff;
              }
            `}
            onClick={(e) => {
              onToggleChildrenDrawer(e, CREATE_ARTICLE);
            }}
          >
            <span css={itemTitleStyle}>添加新页</span>
            <span>
              <IconFont type="icon-plus" />
            </span>
          </li>
        </ul>
      </div>
      <Global
        styles={css`
          .ant-collapse-icon-position-right
            > .ant-collapse-item
            > .ant-collapse-header {
            padding: 7px 16px;
          }
        `}
      />
    </div>
  );
}

export default CollectionCatalogue;
