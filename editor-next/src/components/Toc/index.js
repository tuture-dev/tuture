import React from 'react';
import { Row, Col, Input } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import IconFont from '../IconFont';

const { Search } = Input;

const assistInfoStyle = css`
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(140, 140, 140, 1);
  line-height: 20px;
  margin-top: 8px;
`;

const containerStyle = css`
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(232, 232, 232, 1);
  padding-top: 32px;
  padding-bottom: 32px;
`;

const headerStyle = css`
  border-bottom: 1px solid #eeeeee;
  padding-bottom: 16px;
`;

const listItemStyle = css`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  background: rgba(247, 247, 250, 1);
  border-radius: 2px;
  border: 1px solid rgba(232, 232, 232, 1);
  padding-left: 24px;
  padding-right: 24px;
  margin-bottom: 16px;
`;

const listItemActionStyle = css`
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(140, 140, 140, 1);
  line-height: 22px;
`;

function Toc() {
  const articleList = [
    {
      id: '1',
      name: 'Taro 小程序大型实战（一）：熟悉的 React，熟悉的 Hooks',
      level: 0,
    },
    {
      id: '2',
      name: 'React 代码，熟悉的味道',
      articleId: '1',
      level: 1,
    },
    {
      id: '3',
      name: 'Hooks 轻装上阵',
      articleId: '1',
      level: 1,
    },
    {
      id: '4',
      name: '搞定 Footer 的 Redux 化',
      articleId: '1',
      level: 1,
    },
    {
      id: '5',
      name: 'Taro 小程序大型实战（一）：熟悉的 React，熟悉的 Hooks',
      level: 0,
    },
    {
      id: '6',
      name: 'Taro 小程序大型实战（一）：熟悉的 React，熟悉的 Hooks',
      level: 0,
    },
    {
      id: '7',
      name: 'Taro 小程序大型实战（一）：熟悉的 React，熟悉的 Hooks',
      level: 0,
    },
  ];

  return (
    <div
      css={css`
        width: 1040px;
        margin: auto;
      `}
    >
      <Row>
        <Col
          span={8}
          css={css`
            box-sizing: border-box;
            padding-left: 12px;
            padding-right: 12px;
          `}
        >
          <div
            className="menu-wrapper step-list"
            css={css`
              ${containerStyle}
              padding-left: 24px;
              padding-right: 24px;
            `}
          >
            <div className="menu-header" css={headerStyle}>
              <h5
                css={css`
                  font-size: 16px;
                `}
              >
                待分配步骤
              </h5>

              <p css={assistInfoStyle}>把步骤分配给目录中对应的文章</p>
            </div>
            <div className="menu-body">
              <div
                className="step-list-filter"
                css={css`
                  width: 100%;
                  margin-top: 16px;
                  margin-bottom: 16px;
                `}
              >
                <Search
                  placeholder="搜索步骤的标题"
                  onSearch={(value) => console.log(value)}
                  style={{ height: '40px' }}
                />
              </div>
              <ul
                className="step-list"
                css={css`
                  list-style: none;
                  padding: 0;
                  margin: 0;
                `}
              >
                {['你好', '你好', '你好', '你好'].map((item) => (
                  <li
                    css={css`
                      ${listItemStyle}
                      height: 52px;

                      &:hover .list-item-action {
                        visibility: visible;
                      }

                      &:hover {
                        cursor: pointer;
                      }
                    `}
                  >
                    <span>{item}</span>
                    <span
                      className="list-item-action"
                      css={css`
                        ${listItemActionStyle}

                        display: flex;
                        align-items: center;
                        visibility: hidden;
                      `}
                    >
                      <span
                        css={css`
                          margin-right: 8px;
                        `}
                      >
                        添加
                      </span>
                      <IconFont
                        type="icon-doubleright"
                        css={css`
                          & > svg {
                            width: 8px;
                            height: 8px;
                          }
                        `}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Col>
        <Col
          span={16}
          css={css`
            box-sizing: border-box;

            padding-left: 12px;
            padding-right: 12px;
          `}
        >
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
              <p css={assistInfoStyle}>
                选择文章，点击或拖拽左边的步骤进行分配
              </p>
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
                {articleList.map((item) => (
                  <li
                    css={css`
                      ${listItemStyle}
                      height: 40px;

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
                    `}
                  >
                    <span>{item.name}</span>
                    <span
                      className="list-item-tail"
                      css={css`
                        ${listItemActionStyle}
                      `}
                    >
                      {item.articleId ? '步骤' : '02-25 16:40'}
                    </span>
                    <span
                      className="list-item-action"
                      css={css`
                        ${listItemActionStyle}

                        display: none;
                      `}
                    >
                      {!item.articleId && (
                        <IconFont
                          type="icon-edit"
                          css={css`
                            margin-right: 24px;
                            & > svg {
                              width: 12px;
                              height: 12px;
                            }

                            color: #8c8c8c;

                            &:hover {
                              color: #595959;
                              cursor: pointer;
                            }
                          `}
                        />
                      )}

                      <IconFont
                        type="icon-delete1"
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
        </Col>
      </Row>
    </div>
  );
}

export default Toc;
