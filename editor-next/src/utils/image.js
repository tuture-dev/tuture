import { message } from 'antd';
import { insertVoid } from 'editure';
import { IMAGE } from 'editure-constants';

export const uploadImage = (file, callback) => {
  const data = new FormData();
  data.append('file', file);

  fetch('/upload', {
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then((res) => res.json())
    .then((res) => callback(null, res.path))
    .catch((err) => callback(err));
};

export const createInsertImageCallback = (editor) => (err, url) => {
  console.log('err', err);
  console.log('url', url);
  if (err) return message.error('图片上传失败！');
  insertVoid(editor, IMAGE, { url });
};

export const createDropListener = (editor) => (e) => {
  e.preventDefault();
  e.persist();

  const { files } = e.dataTransfer;

  if (files.length === 0 || !/\.(png|jpe?g|bmp|gif)$/.test(files[0].name)) {
    // No file, or not an image.
    return;
  }

  uploadImage(files[0], createInsertImageCallback(editor));
};

export const withImages = (editor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) =>
    element.type === IMAGE ? true : isVoid(element);

  editor.insertData = (data) => {
    const { files } = data;

    if (files && files.length > 0) {
      uploadImage(files[0], createInsertImageCallback(editor));
    } else {
      insertData(data);
    }
  };

  return editor;
};
