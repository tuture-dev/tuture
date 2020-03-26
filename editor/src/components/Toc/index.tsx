import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Input,
  Icon,
  message,
  Modal,
  Tag,
  Tooltip,
  Popconfirm,
} from 'antd';
import classnames from 'classnames';
import omit from 'lodash.omit';
import { useDispatch, useSelector, useStore } from 'react-redux';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import IconFont from '../../components/IconFont';

const { Search } = Input;
const { confirm } = Modal;

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
  padding-left: 16px;
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

const activeListItemStyle = css`
  border: 1px solid #999999;
`;

function Toc() {
  const store: any = useStore();
  const dispatch: any = useDispatch();

  const defaultUnassignedStepList = useSelector(
    store.select.collection.getUnassignedStepList,
  );

  console.log('defaultUnassignedStepList', defaultUnassignedStepList);

  const defaultArticleStepList = useSelector(
    store.select.collection.getArticleStepList,
  );
  const isSaving = useSelector((state: any) => state.toc.isSaving);

  const [searchValue, setSearchValue] = useState('');
  const [activeArticle, setActiveArticle] = useState('');
  const [articleStepList, setArticleStepList]: [any, any] = useState(
    defaultArticleStepList,
  );
  const [unassignedStepList, setUnassignedStepList]: [any, any] = useState(
    defaultUnassignedStepList,
  );
  const [deleteOutdatedStepList, setDeleteOutdatedStepList] = useState([]);

  useEffect(() => {
    if (isSaving) {
      dispatch.toc.save({
        articleStepList,
        unassignedStepList,
        deleteOutdatedStepList,
      });
    }
  }, [isSaving]);

  useEffect(() => {
    setUnassignedStepList(defaultUnassignedStepList);
  }, [defaultUnassignedStepList]);

  useEffect(() => {
    setArticleStepList(defaultArticleStepList);
  }, [defaultArticleStepList]);

  const filteredArticleList = articleStepList.filter((articleStep: any) => {
    if (!articleStep?.articleId) {
      return true;
    }

    if (activeArticle === articleStep.articleId) {
      return true;
    }

    return false;
  });
  const filteredUnassignedStepList = unassignedStepList.filter((step: any) => {
    const isQualified = step.name.indexOf(searchValue);
    if (isQualified >= 0) {
      return true;
    }

    return false;
  });

  function toggleActiveArticle(articleId: any) {
    if (activeArticle === articleId) {
      setActiveArticle('');
    } else {
      setActiveArticle(articleId);
    }
  }

  function handleAddStep(stepItem: any) {
    if (!activeArticle) {
      message.warning('请选中文章，再添加步骤');
    } else {
      const targetArticleStepIndex = articleStepList.findIndex(
        (articleStep: any) =>
          articleStep?.articleId === activeArticle &&
          articleStep?.number > stepItem.number,
      );
      const articleStepsLen = articleStepList.filter(
        (articleStep: any) => articleStep?.articleId === activeArticle,
      ).length;

      if (targetArticleStepIndex < 0 && articleStepsLen === 0) {
        const articleIndex = articleStepList.findIndex(
          (articleStep: any) => articleStep.id === activeArticle,
        );

        const newArticleStepList = [
          ...articleStepList.slice(0, articleIndex + 1),
          { ...stepItem, articleId: activeArticle },
          ...articleStepList.slice(articleIndex + 1),
        ];
        setArticleStepList(newArticleStepList);
      } else if (targetArticleStepIndex < 0 && articleStepsLen > 0) {
        const articleIndex = articleStepList.findIndex(
          (articleStep: any) => articleStep.id === activeArticle,
        );

        const newArticleStepList = [
          ...articleStepList.slice(0, articleIndex + articleStepsLen + 1),
          { ...stepItem, articleId: activeArticle },
          ...articleStepList.slice(articleIndex + articleStepsLen + 1),
        ];
        setArticleStepList(newArticleStepList);
      } else {
        const newArticleStepList = [
          ...articleStepList.slice(0, targetArticleStepIndex),
          { ...stepItem, articleId: activeArticle },
          ...articleStepList.slice(targetArticleStepIndex),
        ];
        setArticleStepList(newArticleStepList);
      }

      const newUnassignedStepList = unassignedStepList.filter(
        (step: any) => step.id !== stepItem.id,
      );
      setUnassignedStepList(newUnassignedStepList);

      message.success('添加步骤成功');
    }
  }

  function handleInsertStep(step: any, stepList: [any]) {
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
      const newStepList = stepList.concat(omit(step, ['articleId']));

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

      setArticleStepList(newArticleStepList);

      const newUnassignedStepList = handleInsertStep(
        articleStepItem,
        unassignedStepList,
      );
      setUnassignedStepList(newUnassignedStepList);

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

    setUnassignedStepList(newUnassignedStepList);
    setArticleStepList(newArticleStepList);
    setActiveArticle('');

    message.success('删除文章成功');
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
                  onSearch={(value) => setSearchValue(value)}
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
                {filteredUnassignedStepList.map((item: any) => (
                  <li
                    key={item.id}
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
                        width: ${item.outdated ? '94px' : '134px'};
                        display: inline-block;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                      `}
                    >
                      {item.name}
                    </span>
                    <Popconfirm
                      title={`确定删除此过时步骤 ${item.name} 吗？`}
                      onConfirm={() => {
                        setDeleteOutdatedStepList(
                          deleteOutdatedStepList.concat(item.id),
                        );

                        const newUnassignedStepList = unassignedStepList.filter(
                          (step: any) => step.id !== item.id,
                        );
                        setUnassignedStepList(newUnassignedStepList);
                      }}
                      okText="确认"
                      cancelText="取消"
                    >
                      <span
                        className="list-item-action"
                        css={css`
                          ${listItemActionStyle}

                          visibility: hidden;
                          margin-right: 12px;
                        `}
                      >
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
                    </Popconfirm>

                    <span
                      className="list-item-action"
                      onClick={() => handleAddStep(item)}
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
                选择文章，点击添加或拖拽左边的步骤进行分配
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
                            activeArticle === item.id
                              ? 'caret-down'
                              : 'caret-right'
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
        </Col>
      </Row>
    </div>
  );
}

export default Toc;
