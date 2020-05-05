import React, { useState, useEffect } from 'react';
import {
  message,
  Form,
  Input,
  Icon,
  Button,
  Select,
  Transfer,
  Upload,
  Divider,
  Modal,
  Tag,
  Tooltip,
} from 'antd';
import { UploadProps } from 'antd/lib/upload/interface';
import { FormComponentProps } from 'antd/lib/form';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { Article, Meta, randHex } from '@tuture/core';
import { CollectionStep } from '@tuture/local-server';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { EDIT_ARTICLE } from 'utils/constants';
import { IMAGE_HOSTING_URL } from 'utils/image';
import { RootState, Store, Dispatch } from 'store';

const { Option } = Select;
const { confirm } = Modal;

function showDeleteConfirm(
  name: string,
  dispatch: Dispatch,
  articleId: string,
  nowArticleId: string,
  history: History,
) {
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

type CreateEditArticleValueType = {
  cover: UploadProps;
  name: string;
  topics: string[];
  steps: string[];
  categories: string[];
};

interface CreateEditArticleProps
  extends FormComponentProps<CreateEditArticleValueType> {
  childrenDrawerType: string;
}

function CreateEditArticle(props: CreateEditArticleProps) {
  const store = useStore() as Store;
  const dispatch = useDispatch<Dispatch>();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [collectionSteps, setCollectionSteps] = useState<CollectionStep[]>([]);

  // get router history && first article id for delete jump
  const history = useHistory();

  // get editArticle Commits
  const { editArticleId, nowArticleId } = useSelector(
    (state: RootState) => state.collection,
  );

  const [initialTargetKeys, setInitialTargetKeys] = useState<string[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/collection-steps')
      .then((res) => res.json())
      .then((data) => {
        setCollectionSteps(data);

        // set TargetKeys
        const targetKeys =
          props.childrenDrawerType === EDIT_ARTICLE
            ? (data as CollectionStep[])
                .filter((step) => step.articleId === editArticleId)
                .map((step) => step.key)
            : [];

        setTargetKeys(targetKeys);
        setInitialTargetKeys(targetKeys);
      });
  }, [editArticleId, props.childrenDrawerType]);

  // get nowArticle Meta
  const meta: Meta = useSelector(
    store.select.collection.getArticleMetaById({ id: editArticleId }),
  );
  const articleMeta: Partial<Meta> =
    props.childrenDrawerType === EDIT_ARTICLE ? meta : {};

  const initialTopics = articleMeta?.topics || [];
  const initialCategories = articleMeta?.categories || [];
  const initialCover = articleMeta?.cover
    ? [
        {
          url: articleMeta?.cover,
          uid: '-1',
          name: articleMeta?.cover.split('/').slice(-1)[0],
          status: 'done',
        },
      ]
    : [];
  const initialName = articleMeta?.name || '';
  const coverProps: Partial<UploadProps> = {
    action: IMAGE_HOSTING_URL,
    listType: 'picture',
    defaultFileList: [],
  };

  const [fileList, setFileList] = useState(initialCover);
  const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    props.form.validateFields((err, values) => {
      if (!err) {
        const { cover, name, topics, steps, categories } = values;

        const article = { name } as Article;

        if (topics) {
          article.topics = topics;
        }

        if (categories) {
          article.categories = categories;
        }

        if (cover) {
          let url =
            Array.isArray(cover?.fileList) && cover?.fileList.length > 0
              ? cover?.fileList[0].url || cover?.fileList[0].response.data
              : '';

          if (!url && Array.isArray(cover) && cover.length > 0) {
            url = cover[0].url;
          }

          article.cover = url;
        }

        if (props.childrenDrawerType === EDIT_ARTICLE) {
          dispatch.collection.editArticle(article);

          let newlyAddedStepsId: string[] = [];

          // If released, set articleId null
          collectionSteps.forEach((step, index) => {
            if (initialTargetKeys.includes(String(index)) && !step.articleId) {
              // Remove this step from currently edited article.
              dispatch.collection.setStepById({
                stepId: step.id,
                stepProps: { articleId: null },
              });
            }

            if (
              steps.includes(String(index)) &&
              !initialTargetKeys.includes(String(index))
            ) {
              // if newly steps
              newlyAddedStepsId.push(step.id);
            }
          });

          dispatch.collection.save({ keys: ['articles', 'fragment'] }); // If exists newly addSteps, then update collection

          if (newlyAddedStepsId.length > 0) {
            dispatch.collection.updateSteps({
              articleId: editArticleId as string,
              updatedStepsId: newlyAddedStepsId,
            });
          }

          message.success('保存成功');
        } else {
          // Create new article.
          article.id = randHex(8);

          // Update articleId field for selected steps.
          const updatedStepsId: string[] = [];
          collectionSteps.forEach((step, index) => {
            if (steps.includes(String(index))) {
              updatedStepsId.push(step.id);
            }
          });
          dispatch.collection.createArticle(article);
          dispatch.collection.save({ keys: ['articles'] });
          dispatch.collection.updateSteps({
            articleId: article.id,
            updatedStepsId,
          });

          history.push(`/articles/${article.id}`);
        }

        dispatch.drawer.setChildrenVisible(false);
        dispatch.drawer.setVisible(false);
      }
    });
  }

  function handleTargetChange(nextTargetKeys: string[]) {
    const sortedNextTargetKeys: string[] = nextTargetKeys.sort((prev, post) => {
      if (prev > post) {
        return 1;
      }

      if (prev < post) {
        return -1;
      }

      return 0;
    });

    // check nowTargetKeys status
    const newCollectionSteps = collectionSteps.map((step) => {
      if (targetKeys.includes(step.key) && !nextTargetKeys.includes(step.key)) {
        return { ...step, articleId: '', articleIndex: 0, articleName: '' };
      }

      return step;
    });

    setCollectionSteps(newCollectionSteps);
    setTargetKeys(sortedNextTargetKeys);
  }

  function handleSelectChange(
    sourceSelectedKeys: string[],
    targetSelectedKeys: string[],
  ) {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  }

  function filterOption(inputValue: string, option: any) {
    return option.description.indexOf(inputValue) > -1;
  }

  function handleCoverChange({ fileList }: any) {
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
    setFieldsValue({ cover: resultFileList });
  }

  function handleTopicsChange(topics: string) {
    setFieldsValue({ topics });
  }

  function handleCategoriesChange(categories: string) {
    setFieldsValue({ categories });
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
              fileList={fileList as any[]}
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
          label="分类"
          css={css`
            width: 100%;
          `}
        >
          {getFieldDecorator('categories', {
            initialValue: initialCategories,
          })(
            <Select
              mode="tags"
              placeholder="输入文章分类"
              onChange={handleCategoriesChange}
            >
              {getFieldValue('categories').map((category: string) => (
                <Option key={category}>{category}</Option>
              ))}
            </Select>,
          )}
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
              {getFieldValue('topics').map((topic: string) => (
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
              render={(item) => {
                if (targetKeys.includes(item.key)) {
                  return item.title!;
                }

                return (
                  <span>
                    {item?.articleId && (
                      <Tooltip
                        title={`此步骤已经被文章 ${item?.articleName} 选择了`}
                      >
                        <Tag
                          color="#02b875"
                          css={css`
                            color: #fff;
                            &:hover {
                              cursor: pointer;
                            }
                          `}
                        >
                          {item.articleIndex + 1}
                        </Tag>
                      </Tooltip>
                    )}
                    <span>{item.title}</span>
                  </span>
                );
              }}
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
              onClick={() => dispatch.drawer.setChildrenVisible(false)}
            >
              取消
            </Button>
            <Button htmlType="submit" type="primary">
              确认
            </Button>
          </div>
        </Form.Item>
      </Form>
      {props.childrenDrawerType === EDIT_ARTICLE && (
        <React.Fragment>
          <Divider />
          <div
            onClick={() =>
              showDeleteConfirm(
                articleMeta.name!,
                dispatch,
                editArticleId!,
                nowArticleId!,
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
        </React.Fragment>
      )}
    </div>
  );
}

export default Form.create<CreateEditArticleProps>({
  name: 'CreateEditArticle',
})(CreateEditArticle);
