import React, { useState } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';

/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';

import { EDIT_ARTICLE } from '../utils/constants';

function CollectionCatalogue() {
  const { childrenVisible, childrenDrawerType } = useSelector(
    (state) => state.drawer,
  );
  const [selectItem, setSelectItem] = useState('');

  const store = useStore();
  const dispatch = useDispatch();

  const collectionCatalogue = useSelector(
    store.select.collection.getCollectionCatalogue,
  );

  function onToggleChildrenDrawer(toggleChildrenDrawerType) {
    if (childrenDrawerType === toggleChildrenDrawerType) {
      dispatch.drawer.setChildrenVisible(!childrenVisible);
    }

    if (!childrenVisible) {
      dispatch.drawer.setChildrenVisible(true);
    }

    dispatch.drawer.setChildrenDrawerType(toggleChildrenDrawerType);
  }

  function onCatalogueItemClick(articleId) {
    setSelectItem(articleId);
    dispatch.collection.setNowArticle(articleId);
  }

  return (
    <div>
      <div>
        <ul
          className="catalogue"
          css={css`
            list-style: none;
            padding: 0;
            margin: 0;
            width: 100%;
          `}
        >
          {collectionCatalogue.map((item) => (
            <li
              className="catalogue-item"
              key={item.id}
              id={item.id}
              onClick={() => onCatalogueItemClick(item.id)}
              css={css`
                height: 37px;
                line-height: 37px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                padding-left: 16px;
                padding-right: 24px;
                margin-bottom: 8px;

                background: ${selectItem === item.id ? '#FFF' : 'transparent'};

                &:hover {
                  background: #fff;
                  cursor: pointer;
                }

                &:hover > span {
                  visibility: visible;
                }
              `}
            >
              <span>
                <Link
                  to={`/articles/${item.id}`}
                  css={css`
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 1);
                    line-height: 20px;
                  `}
                >
                  {item.name}
                </Link>
              </span>
              <span
                css={css`
                  visibility: hidden;

                  &:hover {
                    color: #02b875;
                  }
                `}
                onClick={() => onToggleChildrenDrawer(EDIT_ARTICLE)}
              >
                <Icon type="ellipsis" />
              </span>
            </li>
          ))}
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
