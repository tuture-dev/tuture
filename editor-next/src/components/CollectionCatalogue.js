import React from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { Button, Collapse } from 'antd';

/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';

import { CREATE_ARTICLE } from '../utils/constants';

const { Panel } = Collapse;

function CollectionCatalogue() {
  const { childrenVisible, childrenDrawerType } = useSelector(
    (state) => state.drawer,
  );

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

  console.log('collectionCatalogue', collectionCatalogue);

  function onChange() {}

  return (
    <div>
      <div
        css={css`
          margin-top: 40px;
        `}
      >
        <Collapse
          defaultActiveKey={['1']}
          expandIconPosition="right"
          onChange={onChange}
          css={css`
            border: none;
            background: transparent;

            & > .ant-collapse-item {
              border: none;
            }
          `}
        >
          {collectionCatalogue.map((article, index) => (
            <Panel
              header={article.name}
              key={index}
              css={css`
                margin-bottom: 24px;
                background: rgb(247, 247, 250);

                & > .ant-collapse-content {
                  border-top: none;
                  background: transparent;

                  font-family: PingFangSC-Regular;
                  font-size: 14px;
                  color: rgba(0, 0, 0, 0.65);
                  line-height: 22px;
                }

                & > .ant-collapse-header {
                  background: transparent;
                  font-size: 14px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: rgba(0, 0, 0, 1);
                  line-height: 20px;
                }

                &.ant-collapse-item-active > .ant-collapse-header {
                  background: #fff;
                }
              `}
            >
              <div
                css={css`
                  padding-left: 32px;
                `}
              >
                {article.commitArrWithName.map((commitItem) => (
                  <p key={commitItem.commit}>{commitItem.name}</p>
                ))}
              </div>
            </Panel>
          ))}
        </Collapse>
        <Button
          type="primary"
          css={css`
            margin-top: 40px;
          `}
          onClick={() => onToggleChildrenDrawer(CREATE_ARTICLE)}
        >
          创建新页
        </Button>
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
