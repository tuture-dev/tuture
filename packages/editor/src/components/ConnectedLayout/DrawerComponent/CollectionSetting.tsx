import React, { useState } from 'react';
import { Form, Input, Icon, Button, Select, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import {
  UploadFileStatus,
  UploadType,
  UploadProps,
} from 'antd/lib/upload/interface';
import { useDispatch, useSelector, useStore } from 'react-redux';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { Store, Dispatch, RootState } from 'store';
import { Meta } from '../../../../../types';
import { IMAGE_HOSTING_URL } from 'utils/image';

const { Option } = Select;
const { TextArea } = Input;

interface CollectionSettingProps extends FormComponentProps {}

function CollectionSetting(props: CollectionSettingProps) {
  const store = useStore() as Store;
  const dispatch = useDispatch<Dispatch>();

  // submit status
  const editCollectionLoading = useSelector(
    (state: RootState) => state.loading.effects.collection.editCollection,
  );

  // get nowArticle Meta
  const collectionMeta = useSelector<RootState, Meta>(
    store.select.collection.collectionMeta,
  );

  const initialTopics = collectionMeta?.topics || [];
  const initialCover = collectionMeta?.cover
    ? [
        {
          url: collectionMeta?.cover,
          uid: '-1',
          name: collectionMeta?.cover.split('/').slice(-1)[0],
          status: 'done' as UploadFileStatus,
          size: collectionMeta?.cover.split('/').length,
          type: 'drag' as UploadType,
        },
      ]
    : [];
  const initialName = collectionMeta?.name || '';
  const initialDescription = collectionMeta?.description || '';
  const coverProps: Partial<UploadProps> = {
    action: IMAGE_HOSTING_URL,
    listType: 'picture',
    defaultFileList: initialCover,
  };

  const [fileList, setFileList] = useState(initialCover);

  const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    props.form.validateFields((err: Error, values: any) => {
      if (!err) {
        const {
          cover,
          name,
          topics,
          description,
        }: { [key: string]: any } = values;

        let res: { [key: string]: any } = {
          name,
        };

        if (topics) {
          res = { ...res, topics };
        }

        if (description) {
          res = { ...res, description };
        }

        if (cover) {
          let url =
            Array.isArray(cover?.fileList) && cover?.fileList.length > 0
              ? cover?.fileList[0].url || cover?.fileList[0].response.data
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
    setFieldsValue({
      cover: resultFileList,
    });
  }

  function handleTopicsChange(topics: string) {
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
              {getFieldValue('topics').map((topic: string) => (
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

export default Form.create<CollectionSettingProps>({
  name: 'CollectionSetting',
})(CollectionSetting);
