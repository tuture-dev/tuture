import { useState } from 'react';
import { Form, Input, Icon, Button, Select, Upload } from 'antd';
import { useDispatch, useSelector, useStore } from 'react-redux';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { Option } = Select;
const { TextArea } = Input;

function CollectionSetting(props) {
  const store = useStore();
  const dispatch = useDispatch();

  // submit status
  const { editCollection: editCollectionLoading } = useSelector(
    (state) => state.loading.effects.collection,
  );

  // get nowArticle Meta
  const collectionMeta = useSelector(store.select.collection.collectionMeta);

  const initialTopics = collectionMeta?.topics || [];
  const initialCover = collectionMeta?.cover
    ? [
        {
          url: `/${collectionMeta?.cover}`,
          uid: '-1',
          name: collectionMeta?.cover.split('/').slice(-1)[0],
          status: 'done',
        },
      ]
    : [];
  const initialName = collectionMeta?.name || '';
  const initialDescription = collectionMeta?.description || '';
  const coverProps = {
    action: '/upload',
    listType: 'picture',
    defaultFileList: [initialCover],
  };

  const [fileList, setFileList] = useState(initialCover);

  const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

  function handleSubmit(e) {
    e.preventDefault();

    props.form.validateFields((err, values) => {
      if (!err) {
        const { cover, name, topics, description } = values;

        let res = {
          name,
        };

        if (topics) {
          res = { ...res, topics };
        }

        if (description) {
          res = { ...res, description };
        }

        console.log('topics', topics);

        if (cover) {
          let url =
            Array.isArray(cover?.fileList) && cover?.fileList.length > 0
              ? cover?.fileList[0].url || cover?.fileList[0].response.path
              : '';

          if (!url && Array.isArray(cover) && cover.length > 0) {
            url = cover[0].url;
          }

          res = { ...res, cover: url };
        }

        dispatch.collection.editCollection(res);
        dispatch.collection.saveCollection();
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

  function handleTopicsChange(topics) {
    setFieldsValue({
      topics,
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
          {getFieldDecorator('topics', {
            initialValue: initialTopics,
          })(
            <Select
              mode="tags"
              placeholder="输入文集标签"
              allowClear
              onChange={handleTopicsChange}
            >
              {getFieldValue('topics').map((topic) => (
                <Option key={topic}>{topic}</Option>
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
            <Button
              htmlType="submit"
              type="primary"
              loading={editCollectionLoading}
            >
              确认
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Form.create({ name: 'CollectionSetting' })(CollectionSetting);
