import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Divider } from 'antd';
import { Link } from 'react-router-dom';

/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';

import IconFont from 'components/IconFont';
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
    (state) => state.drawer,
  );
  const [selectItem, setSelectItem] = useState('');

  const dispatch = useDispatch();
  const { articles } = useSelector((state) => state.collection.collection);

  function onToggleChildrenDrawer(e, toggleChildrenDrawerType, articleId) {
    e.stopPropagation();
    if (childrenDrawerType === toggleChildrenDrawerType) {
      dispatch({
        type: 'drawer/setChildrenVisible',
        payload: !childrenVisible,
      });
    }

    if (!childrenVisible) {
      dispatch({ type: 'drawer/setChildrenVisible', payload: true });
    }

    if (toggleChildrenDrawerType === EDIT_ARTICLE) {
      dispatch.collection.setEditArticleId(articleId);
    }

    dispatch({
      type: 'drawer/setChildrenDrawerType',
      payload: toggleChildrenDrawerType,
    });
  }

  function onCatalogueItemClick(articleId) {
    dispatch({ type: 'drawer/setVisible', payload: false });
    setSelectItem(articleId);
    dispatch({ type: 'collection/setNowArticle', payload: articleId });
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
              <Link to={`/articles/${article.id}`} css={itemTitleStyle}>
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
              </Link>
              <span
                css={css`
                  &:hover {
                    color: #02b875;
                  }
                `}
                onClick={(e) =>
                  onToggleChildrenDrawer(e, EDIT_ARTICLE, article.id)
                }
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
