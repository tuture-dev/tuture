import React from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';

const { SubMenu } = Menu;

function CollectionCatalogue() {
  // const { childrenVisible, childrenDrawerType } = useSelector(
  //   (state) => state.drawer,
  // );
  const { nowArticleId } = useSelector((state) => state.collection);

  const store = useStore();
  const dispatch = useDispatch();

  const collectionCatalogue = useSelector(
    store.select.collection.getCollectionCatalogue,
  );

  // function onToggleChildrenDrawer(toggleChildrenDrawerType) {
  //   if (childrenDrawerType === toggleChildrenDrawerType) {
  //     dispatch.drawer.setChildrenVisible(!childrenVisible);
  //   }

  //   if (!childrenVisible) {
  //     dispatch.drawer.setChildrenVisible(true);
  //   }

  //   dispatch.drawer.setChildrenDrawerType(toggleChildrenDrawerType);
  // }

  function handleSwitchArticle(articleId) {
    dispatch.collection.setNowArticle(articleId);
  }

  return (
    <div>
      <div
        css={css`
          margin-top: 32px;
        `}
      >
        <Menu
          defaultSelectedKeys={['1']}
          mode="inline"
          css={css`
            width: 100%;
            border: none;
            background: transparent;

            & > .ant-collapse-item {
              border: none;
            }
          `}
        >
          {collectionCatalogue.map((article) => (
            <SubMenu
              key={article.id}
              title={
                <Link
                  to={`/articles/${article.id}`}
                  css={css`
                    color: #000;
                  `}
                >
                  {article.name}
                </Link>
              }
              onTitleClick={() => handleSwitchArticle(article.id)}
              css={css`
                background: transparent;

                &.ant-menu-submenu-open > .ant-menu-submenu-title {
                  background: ${article.id === nowArticleId
                    ? '#fff'
                    : 'transparent'};
                  padding-right: 24px;
                }

                & > .ant-menu {
                  background: transparent;
                }
              `}
            >
              {article.commitArrWithName.map((commitItem) => (
                <Menu.Item key={commitItem.commit}>{commitItem.name}</Menu.Item>
              ))}
            </SubMenu>
          ))}
        </Menu>
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
