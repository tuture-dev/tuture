import React, { useState } from 'react';
import { Form, Input, Icon, Button, Select, Upload } from 'antd';
import { useDispatch, useSelector, useStore } from 'react-redux';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { Option } = Select;
const { TextArea } = Input;

function CollectionSetting(props) {
  const store = useStore();
  const dispatch = useDispatch();
  const [fileList, setFileList] = useState([]);

  // submit status
  const loading = useSelector((state) => state.loading.models.collection);

  // get nowArticle Meta
  const nowArticleMeta = useSelector(store.select.collection.collectionMeta);

  const initialTags = nowArticleMeta?.tags || [];
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
  const initialName = nowArticleMeta?.name || '';
  const initialDescription = nowArticleMeta?.description || '';
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
        const { cover, name, tags, description } = values;

        let res = {
          name,
        };

        if (tags) {
          res = { ...res, tags };
        }

        if (description) {
          res = { ...res, description };
        }

        if (cover) {
          const url =
            Array.isArray(cover?.fileList) && cover?.fileList.length > 0
              ? cover?.fileList[0].url
              : '';
          res = { ...res, cover: url };
        }

        dispatch.collection.editCollection(res);
      }
    });
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

  function handleTagsChange(tags) {
    setFieldsValue({
      tags,
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
          label="文集封面"
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
          label="文集标题"
          css={css`
            width: 100%;
          `}
        >
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入文集标题' }],
            initialValue: initialName,
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
              placeholder="输入文集标签"
              onChange={handleTagsChange}
            >
              {getFieldValue('tags').map((tag) => (
                <Option key={tag}>{tag}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="文集摘要">
          {getFieldDecorator('description', {
            initialValue: initialDescription,
          })(
            <TextArea
              placeholder="请输入文集摘要"
              autoSize={{ minRows: 4, maxRows: 8 }}
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
              onClick={() => dispatch.drawer.setVisible(false)}
            >
              取消
            </Button>
            <Button htmlType="submit" type="primary" loading={loading}>
              确认
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Form.create({ name: 'CollectionSetting' })(CollectionSetting);
