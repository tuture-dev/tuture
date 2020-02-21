import React, {
  useState,
  createRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Form,
  Upload,
  Icon,
  Modal,
  Input,
  Select,
  Checkbox,
  Button,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { EDIT_ARTICLE } from '../utils/constants';

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const FCForm = forwardRef(({ form }, ref) => {
  const dispatch = useDispatch();
  const { childrenDrawerType } = useSelector((state) => state.drawer);

  useImperativeHandle(ref, () => ({
    form,
  }));

  const { getFieldDecorator } = form;

  const [imageUrl, setImageUrl] = useState();
  const [visible, setVisible] = useState(false);
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 40,
    aspect: 100 / 67,
  });
  const [imageRef, setImageRef] = useState();
  const [croppedImageUrl, setCroppedImageUrl] = useState();
  const normFile = (e) => {
    console.log('Upload event:', e);
    // if (Array.isArray(e)) {
    //   return e;
    // }
    // return e && e.fileList;
  };
  const handleChange = (info) => {
    //Get this url from response in real world.
    getBase64(
      info.file.originFileObj,
      (imageUrl) => setImageUrl(imageUrl),
      setVisible(true),
    );
  };
  // const handleChange = e => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     const reader = new FileReader();
  //     reader.addEventListener('load', () =>
  //       setImageUrl(reader.result),
  //       setVisible(true)
  //     );
  //     reader.readAsDataURL(e.target.files[0]);
  //   }
  // }

  // If you setState the crop in here you should return false.
  const onImageLoaded = (image) => {
    setImageRef(image);
  };

  const onCropComplete = (crop) => {
    makeClientCrop(crop);
  };

  const onCropChange = (crop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    setCrop(crop);
  };

  const makeClientCrop = async (crop) => {
    if (imageRef && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef,
        crop,
        'newFile.jpeg',
      );
      setCroppedImageUrl(croppedImageUrl);
    }
  };

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        console.log(this);
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  };

  const handleOk = (e) => {
    console.log(e);
    setVisible(false);
    setSrc(croppedImageUrl);
  };

  const handleCancel = (e) => {
    console.log(e);
    setVisible(false);
  };

  const deleteImage = (e) => {
    setImageUrl(false);
    e.stopPropagation();
  };

  const loadImage = (
    <div>
      <img src={src} alt="avatar" />
      <span
        onClick={deleteImage}
        css={css`
          position: absolute;
          top: -5px;
          right: 5px;
          font-size: 30px;
          z-index: 1;
        `}
      >
        ×
      </span>
    </div>
  );
  const uploadButton = (
    <div>
      <p className="ant-upload-drag-icon">
        <Icon type="inbox" />
      </p>
      <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
      <p className="ant-upload-hint">支持扩展名：.jpg .png .jpeg</p>
    </div>
  );

  const children = [];
  const { Search } = Input;

  const CheckboxGroup = Checkbox.Group;
  const plainOptions = [
    '11111111111111111111',
    '222222222222222222',
    '33333333333333333',
    '4444444444444444444',
    '5555555555555555555',
    '6666666666666666666',
  ];
  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  const onChange = (checkedList) => {
    setCheckedList(checkedList);
    setIndeterminate(
      !!checkedList.length && checkedList.length < plainOptions.length,
    );
    setCheckAll(checkedList.length === plainOptions.length);
  };
  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const [displayType, setDisplayType] = useState();
  useEffect(() => {
    const type = 'editPage';
    if (type === 'createPage') {
      setDisplayType('none');
    } else if (type === 'editPage') {
      setDisplayType('block');
    }
  }, []);
  return (
    <div
      css={css`
        padding: 0 24px;
      `}
    >
      <Form ref={form} layout="vertical">
        <Form.Item
          label="封面"
          css={css`
            width: 100%;
            height: 180px;
            margin-bottom: 20px;
          `}
        >
          {getFieldDecorator('dragger', {
            valuePropName: 'fileList',
            getValueFromEvent: normFile,
          })(
            <>
              <Upload.Dragger
                name="files"
                action="/upload.do"
                onChange={handleChange}
              >
                {src ? loadImage : uploadButton}
              </Upload.Dragger>
              <Modal
                title="修改头像"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                {imageUrl && (
                  <ReactCrop
                    src={imageUrl}
                    crop={crop}
                    ruleOfThirds
                    onImageLoaded={onImageLoaded}
                    onComplete={onCropComplete}
                    onChange={onCropChange}
                  />
                )}
                {croppedImageUrl && <img alt="Crop" src={croppedImageUrl} />}
              </Modal>
            </>,
          )}
        </Form.Item>
        <Form.Item
          label="标题"
          css={css`
            margin-bottom: 5px;
          `}
        >
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: '请输入标题',
              },
            ],
          })(<Input placeholder="请输入标题" />)}
        </Form.Item>
        <Form.Item
          label="标签"
          hasFeedback
          css={css`
            margin-bottom: 5px;
          `}
        >
          {getFieldDecorator('select', {
            rules: [{ required: true, message: '请选择标签' }],
          })(
            <Select
              mode="tags"
              tokenSeparators={[',']}
              placeholder="输入或点击选择标签"
            >
              {children}
            </Select>,
          )}
        </Form.Item>
        <Form.Item
          label="选择 Commit"
          css={css`
            height: 200px;
            margin-bottom: 5px;
          `}
        >
          <div
            css={css`
              height: 180px;
              border-radius: 4px;
              border: 1px solid rgba(0, 0, 0, 0.15);
            `}
          >
            <div
              css={css`
                padding: 5px;
                border-bottom: 2px solid rgba(0, 0, 0, 0.15);
                margin-bottom: 6px;
              `}
            >
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
                css={css`
                  padding-left: 5px;
                `}
              >
                <span
                  css={css`
                    display: inline-block;
                    margin-right: 90px;
                  `}
                >
                  2/13项
                </span>
                <span>Commits</span>
              </Checkbox>
            </div>
            <div
              css={css`
                height: 50px;
                margin-top: 5px;
              `}
            >
              <div
                css={css`
                  width: 240px;
                  margin: 5px auto;
                `}
              >
                <Search
                  placeholder="请输入 Commit 标题"
                  onSearch={(value) => console.log(value)}
                />
              </div>
              <div
                css={css`
                  padding-left: 5px;
                  height: 99px;
                  overflow: auto;
                `}
              >
                <CheckboxGroup
                  options={plainOptions}
                  value={checkedList}
                  onChange={onChange}
                  css={css`
                    padding-left: 5px;
                  `}
                />
              </div>
            </div>
          </div>
        </Form.Item>
        <div
          css={css`
            margin-top: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.15);
          `}
        >
          <Button
            css={css`
              margin-right: 115px;
            `}
            onClick={() =>
              dispatch({ type: 'drawer/setChildrenVisible', payload: false })
            }
          >
            取消
          </Button>
          <Button type="primary">确认</Button>
        </div>
      </Form>
      {childrenDrawerType === EDIT_ARTICLE && (
        <div
          css={css`
            display: ${displayType};
          `}
        >
          <div
            css={css`
              margin-top: 10px;
            `}
          >
            <span
              css={css`
                font-size: 14px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: rgba(0, 0, 0, 1);
                line-height: 22px;
                cursor: pointer;
              `}
            >
              导出为 Markdown
            </span>
          </div>
          <div
            css={css`
              margin-top: 10px;
            `}
          >
            <span
              css={css`
                font-size: 14px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: rgba(0, 0, 0, 1);
                line-height: 22px;
                cursor: pointer;
              `}
            >
              删除此页
            </span>
          </div>
        </div>
      )}
    </div>
  );
});
const EnhancedFCForm = Form.create()(FCForm);

function CreateEditArticle() {
  const formRef = createRef();
  return (
    <EnhancedFCForm
      onSubmit={() => console.log(formRef.form.getFieldValue('name'))}
      wrappedComponentRef={formRef}
    />
  );
}

export default CreateEditArticle;
