import React, { useState } from 'react';
import { Form, Input, Icon, Button, Select, Transfer, Upload } from 'antd';
import { useDispatch } from 'react-redux';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { Option } = Select;

const mockData = [];
for (let i = 0; i < 20; i++) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    disabled: i % 3 < 1,
  });
}

const oriTargetKeys = mockData
  .filter((item) => +item.key % 3 > 1)
  .map((item) => item.key);

function CreateEditArticle(props) {
  const dispatch = useDispatch();
  const [targetKeys, setTargetKeys] = useState(oriTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [fileList, setFileList] = useState([]);

  const initialTags = [];
  const initialTargetCommits = [];
  const initialCover = [];
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
              dataSource={mockData}
              titles={['现有 Commits', '已选 Commits']}
              targetKeys={targetKeys}
              operations={['选择', '释放']}
              listStyle={{
                width: '100%',
              }}
              css={css`
                display: flex;
                flex-direction: column;
                align-items: center;

                & .ant-transfer-operation {
                  margin-top: 8px;
                  margin-bottom: 8px;
                }
              `}
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
