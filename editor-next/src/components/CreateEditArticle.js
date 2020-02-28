import React, { useState } from 'react';
import {
  Form,
  Input,
  Icon,
  Button,
  Select,
  Transfer,
  Upload,
  Divider,
  Modal,
} from 'antd';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { useHistory } from 'react-router-dom';
import shortid from 'shortid';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { EDIT_ARTICLE } from '../utils/constants';
import { getHeadings } from '../utils/collection';

const { Option } = Select;
const { confirm } = Modal;

function showDeleteConfirm(name, dispatch, articleId, nowArticleId, history) {
  confirm({
    title: `确定要删除 ${name}`,
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      dispatch.drawer.setChildrenVisible(false);

      // If nowEditArticle is nowSelectedArticle, then need re-select nowArticle
      // and jump to the first article or collection page
      if (articleId === nowArticleId) {
        dispatch.collection.setNowArticle('');

        history.push('/');
      }
      dispatch.collection.deleteArticle(articleId);
    },
  });
}

function CreateEditArticle(props) {
  const store = useStore();
  const dispatch = useDispatch();
  const [selectedKeys, setSelectedKeys] = useState([]);

  // get router history && first article id for delete jump
  const history = useHistory();

  // submit status
  const loading = useSelector((state) => state.loading.models.collection);

  // get editArticle Commits
  const { editArticleId, nowArticleId, collection } = useSelector(
    (state) => state.collection,
  );

  // get all steps
  const collectionSteps = collection.steps.map((step, index) => ({
    key: index,
    id: step.id,
    articleId: step.articleId,
    title: getHeadings([step])[0].title,
    disabled: !!step.articleId && step.articleId !== editArticleId,
  }));

  const initialTargetKeys =
    props.childrenDrawerType === EDIT_ARTICLE
      ? collectionSteps
          .filter((step) => step.articleId === editArticleId)
          .map((step) => step.key)
      : [];

  const [targetKeys, setTargetKeys] = useState(initialTargetKeys || []);

  console.log('targetKeys', initialTargetKeys, targetKeys);

  // get nowArticle Meta
  const meta = useSelector(
    store.select.collection.getArticleMetaById({ id: editArticleId }),
  );
  const articleMeta = props.childrenDrawerType === EDIT_ARTICLE ? meta : {};

  const initialTopics = articleMeta?.topics || [];
  const initialCover = articleMeta?.cover
    ? [
        {
          url: articleMeta?.cover,
          uid: '-1',
          name: 'tuture.jpg',
          status: 'done',
        },
      ]
    : [];
  const initialName = articleMeta?.name || '';
  const coverProps = {
    action: '/upload',
    listType: 'picture',
    defaultFileList: [],
  };

  const [fileList, setFileList] = useState(initialCover);
  const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

  function handleSubmit(e) {
    e.preventDefault();

    props.form.validateFields((err, values) => {
      if (!err) {
        const { cover, name, topics, steps } = values;

        const article = { name };

        if (topics) {
          article.topics = topics;
        }

        console.log('cover', cover);

        if (cover) {
          let url =
            Array.isArray(cover?.fileList) && cover?.fileList.length > 0
              ? cover?.fileList[0].url || cover?.fileList[0].response.path
              : '';

          if (!url && Array.isArray(cover) && cover.length > 0) {
            url = cover[0].url;
          }

          article.cover = url;
        }

        console.log('article', article, editArticleId);

        if (props.childrenDrawerType === EDIT_ARTICLE) {
          dispatch.collection.editArticle(article);
          dispatch.drawer.setVisible(false);

          collectionSteps.forEach((step, index) => {
            if (step.articleId === editArticleId) {
              if (!steps.includes(index)) {
                // Remove this step from currently edited article.
                dispatch.collection.setStepById({
                  stepId: step.id,
                  stepProps: { articleId: null },
                });
              }
            } else {
              if (steps.includes(index)) {
                // Add this step to the currently edited article.
                dispatch.collection.setStepById({
                  stepId: step.id,
                  stepProps: { articleId: editArticleId },
                });
              }
            }
          });
        } else {
          article.id = shortid.generate();
          dispatch.collection.createArticle(article);

          // Update articleId field for selected steps.
          collectionSteps.forEach((step, index) => {
            if (steps.includes(index)) {
              dispatch.collection.setStepById({
                stepId: step.id,
                stepProps: { articleId: article.id },
              });
            }
          });
        }
      }
    });
  }

  function handleTargetChange(nextTargetKeys) {
    const sortedNextTargetKeys = nextTargetKeys.sort((prev, post) => {
      if (prev > post) {
        return 1;
      }

      if (prev < post) {
        return -1;
      }

      return 0;
    });

    setFieldsValue({ steps: sortedNextTargetKeys });
    setTargetKeys(sortedNextTargetKeys);
  }

  function handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  }

  function filterOption(inputValue, option) {
    return option.description.indexOf(inputValue) > -1;
  }

  function handleCoverChange({ fileList }) {
    let resultFileList = [...fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    resultFileList = resultFileList.slice(-1);

    // 2. Read from response and show file link
    resultFileList = resultFileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(resultFileList);
    setFieldsValue({
      cover: resultFileList,
    });
  }

  function handleTopicsChange(topics) {
    setFieldsValue({ topics });
  }

  return (
    <div
      css={css`
        width: 100%;
        padding: 0 24px;

        & img {
          margin: 0;
        }
      `}
    >
      <Form layout="vertical" onSubmit={handleSubmit}>
        <Form.Item
          label="封面"
          css={css`
            width: 100%;
          `}
        >
          {getFieldDecorator('cover', {
            initialValue: initialCover,
          })(
            <Upload
              fileList={fileList}
              onChange={handleCoverChange}
              {...coverProps}
            >
              <Button>
                <Icon type="upload" /> 上传封面
              </Button>
            </Upload>,
          )}
        </Form.Item>
        <Form.Item
          label="标题"
          css={css`
            width: 100%;
          `}
        >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入文章标题' }],
            initialValue: initialName,
          })(<Input placeholder="标题" />)}
        </Form.Item>
        <Form.Item
          label="标签"
          css={css`
            width: 100%;
          `}
        >
          {getFieldDecorator('topics', {
            initialValue: initialTopics,
          })(
            <Select
              mode="tags"
              placeholder="输入文章标签"
              onChange={handleTopicsChange}
            >
              {getFieldValue('topics').map((topic) => (
                <Option key={topic}>{topic}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="选择步骤">
          {getFieldDecorator('steps', {
            rules: [{ required: true, message: '请选择文章包含的步骤' }],
            initialValue: initialTargetKeys,
          })(
            <Transfer
              dataSource={collectionSteps}
              titles={['所有步骤', '已选步骤']}
              targetKeys={targetKeys}
              operations={['选择', '释放']}
              listStyle={{
                width: 320,
                height: 300,
              }}
              selectedKeys={selectedKeys}
              onChange={handleTargetChange}
              onSelectChange={handleSelectChange}
              showSearch
              filterOption={filterOption}
              render={(item) => item.title}
            />,
          )}
        </Form.Item>
        <Form.Item
          css={css`
            width: 100%;
          `}
        >
          <div>
            <Button
              css={css`
                margin-right: 16px;
              `}
              onClick={() =>
                dispatch({ type: 'drawer/setChildrenVisible', payload: false })
              }
            >
              取消
            </Button>
            <Button htmlType="submit" type="primary" loading={loading}>
              确认
            </Button>
          </div>
        </Form.Item>
      </Form>
      {props.childrenDrawerType === EDIT_ARTICLE && (
        <>
          <Divider />
          <div
            onClick={() =>
              showDeleteConfirm(
                articleMeta.name,
                dispatch,
                editArticleId,
                nowArticleId,
                history,
              )
            }
            css={css`
              &:hover span,
              &:hover svg {
                color: #02b875;
                cursor: pointer;
              }
            `}
          >
            <Icon type="delete" />

            <span
              css={css`
                margin-left: 8px;
                font-size: 14px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: rgba(0, 0, 0, 1);
                line-height: 22px;
              `}
            >
              删除此文章
            </span>
          </div>
        </>
      )}
      <Modal />
    </div>
  );
}

export default Form.create({ name: 'CreateEditArticle' })(CreateEditArticle);
