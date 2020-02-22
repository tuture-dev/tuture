import React, { useState } from 'react';
import { Form, Input, Icon, Button, Select, Transfer, Upload } from 'antd';
import { useDispatch, useSelector, useStore } from 'react-redux';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { EDIT_ARTICLE } from '../utils/constants';

const { Option } = Select;

function makeSelectableCommits(commits = []) {
  const selectableCommits = commits.map((commit) => ({
    key: commit.commit,
    title: commit.name,
    description: commit.name,
    disabled: commit.isSelected,
  }));

  return selectableCommits;
}

function makeTargetKeys(commits = []) {
  const targetKeys = commits.map((commit) => commit.commit);

  return targetKeys;
}

function CreateEditArticle(props) {
  const dispatch = useDispatch();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [fileList, setFileList] = useState([]);

  // get all commit
  const store = useStore();
  const allCommits = useSelector(store.select.collection.getAllCommits);
  const selectableCommits = makeSelectableCommits(allCommits);

  const nowArticleCommits = useSelector(
    store.select.collection.getNowArticleCommits,
  );

  const [targetKeys, setTargetKeys] = useState(
    makeTargetKeys(nowArticleCommits) || [],
  );

  // get nowArticle Meta
  const articleData = useSelector(store.select.collection.nowArticleMeta);
  const nowArticleMeta =
    props.childrenDrawerType === EDIT_ARTICLE ? articleData : {};

  console.log('props', props, nowArticleMeta);

  const initialTags = nowArticleMeta?.tags || [];
  const initialTargetCommits = [];
  const initialCover = nowArticleMeta?.cover
    ? [
        {
          url: nowArticleMeta?.cover,
          uid: '-1',
          name: 'tuture.jpg',
          status: 'done',
        },
      ]
    : [];
  const coverProps = {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    listType: 'picture',
    defaultFileList: [],
  };

  const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

  function handleSubmit(e) {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  function handleChange(nextTargetKeys, direction, moveKeys) {
    setFieldsValue({
      commits: nextTargetKeys,
    });
    setTargetKeys(nextTargetKeys);

    console.log('targetKeys: ', nextTargetKeys);
    console.log('direction: ', direction);
    console.log('moveKeys: ', moveKeys);
  }

  function handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);

    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  }

  function filterOption(inputValue, option) {
    return option.description.indexOf(inputValue) > -1;
  }

  function onCoverChange({ fileList }) {
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
              onChange={onCoverChange}
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
            initialValue: nowArticleMeta?.name || '',
          })(<Input placeholder="标题" />)}
        </Form.Item>
        <Form.Item
          label="标签"
          css={css`
            width: 100%;
          `}
        >
          {getFieldDecorator('tags', {
            initialValue: initialTags,
          })(
            <Select
              mode="tags"
              placeholder="输入文章标签"
              onChange={(tags) => {
                setFieldsValue({
                  tags,
                });
              }}
            >
              {getFieldValue('tags').map((tag) => (
                <Option key={tag}>{tag}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="选择 Commits">
          {getFieldDecorator('commits', {
            rules: [{ required: true, message: '请选择文章涉及的 Commits' }],
            initialValue: initialTargetCommits,
          })(
            <Transfer
              dataSource={selectableCommits}
              titles={['现有 Commits', '已选 Commits']}
              targetKeys={targetKeys}
              operations={['选择', '释放']}
              css={css``}
              selectedKeys={selectedKeys}
              onChange={handleChange}
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
          <div
            css={css`
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            `}
          >
            <Button
              onClick={() =>
                dispatch({ type: 'drawer/setChildrenVisible', payload: false })
              }
            >
              取消
            </Button>
            <Button htmlType="submit" type="primary">
              确认
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Form.create({ name: 'CreateEditArticle ' })(CreateEditArticle);
