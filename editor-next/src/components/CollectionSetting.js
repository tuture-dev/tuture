import React, {
  useState,
  createRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Form, Upload, Icon, Modal, Input, Select, Button } from 'antd';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const FCForm = forwardRef(({ form }, ref) => {
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

  const handleChange = (info) => {
    //Get this url from response in real world.
    getBase64(
      info.file.originFileObj,
      (imageUrl) => setImageUrl(imageUrl),
      setVisible(true),
    );
  };

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

      console.log('croppedImageUrl', croppedImageUrl);
      setCroppedImageUrl(croppedImageUrl);
    }
  };

  const getCroppedImg = (image, crop) => {
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

    const base64Image = canvas.toDataURL('image/jpeg');

    return base64Image;
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
    setSrc(null);
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
  const { TextArea } = Input;

  return (
    <div
      css={css`
        padding: 0 24px;
      `}
    >
      <Form
        ref={form}
        layout="vertical"
        css={css`
          background-color: #fff;
          width: 260px;
          height: 700px;
        `}
      >
        <Form.Item
          label="文集封面"
          css={css`
            with: 100%;
            height: 180px;
            margin-bottom: 10px;
          `}
        >
          {getFieldDecorator('dragger', {
            // valuePropName: 'fileList',
            // getValueFromEvent: normFile,
          })(
            <>
              <Upload.Dragger
                name="files"
                action="/upload.do"
                showUploadList={false}
                onChange={handleChange}
              >
                {src ? loadImage : uploadButton}
              </Upload.Dragger>
              <Modal
                title="修改封面"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <div
                  css={css`
                    display: flex;
                  `}
                >
                  <div
                    css={css`
                      flex: 1;
                      margin-right: 20px;
                    `}
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
                  </div>
                  <div
                    css={css`
                      flex: 1;
                    `}
                  >
                    {croppedImageUrl && (
                      <img alt="Crop" src={croppedImageUrl} />
                    )}
                  </div>
                </div>
              </Modal>
            </>,
          )}
        </Form.Item>
        <Form.Item
          label="文集标题"
          css={css`
            margin-top: 30px;
            margin-bottom: 10px;
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
          label="文集标签"
          hasFeedback
          css={css`
            margin-bottom: 10px;
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
        <Form.Item label="文集摘要">
          {getFieldDecorator('textarea', {
            rules: [{ required: true, message: '请输入文集的摘要' }],
          })(
            <TextArea
              placeholder="请输入文集的摘要"
              autoSize={{ maxRows: 6 }}
            />,
          )}
        </Form.Item>
        <div
          css={css`
            margin-top: 30px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          `}
        >
          <Button
            css={css`
              margin-right: 90px;
            `}
          >
            取消
          </Button>
          <Button type="primary">确认</Button>
        </div>
      </Form>
    </div>
  );
});
const EnhancedFCForm = Form.create()(FCForm);

function CollectionSetting() {
  const formRef = createRef();
  return (
    <EnhancedFCForm
      onSubmit={() => console.log(formRef.form.getFieldValue('name'))}
      wrappedComponentRef={formRef}
    />
  );
}

export default CollectionSetting;
