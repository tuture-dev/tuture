import { IMAGE, PARAGRAPH } from 'editure-constants';
import { Editor, Element, Transforms, getBeforeText } from 'editure';

import { IEditor } from './editor';

export const IMAGE_HOSTING_URL = 'https://imgkr.com/api/files/upload';

export const insertImage = (editor: IEditor, files: FileList) => {
  for (const file of files) {
    const reader = new FileReader();
    const [mime] = file.type.split('/');

    if (mime === 'image') {
      reader.addEventListener('load', () => {
        const url = reader.result;

        if (url) {
          editor.insertVoid(IMAGE, { url: url.toString(), file });
        }
      });

      reader.readAsDataURL(file);
    }
  }
};

export const uploadImage = (
  file: File,
  callback: (err?: Error | null, url?: string) => void,
) => {
  const data = new FormData();
  data.append('file', file);

  fetch(IMAGE_HOSTING_URL, {
    method: 'POST',
    body: data,
  })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((data) => {
      if (!data.success) {
        throw new Error('上传失败，请重试！');
      }
      callback(null, data.data);
    })
    .catch((err: Error) => callback(err));
};

export const createDropListener = (editor: IEditor) => (e: React.DragEvent) => {
  e.preventDefault();
  e.persist();

  const { files } = e.dataTransfer;

  if (files.length === 0 || !/\.(png|jpe?g|bmp|gif)$/.test(files[0].name)) {
    // No file, or not an image.
    return;
  }

  insertImage(editor, files);
};

export const withImages = (editor: IEditor) => {
  const { insertData, deleteBackward, isVoid } = editor;

  editor.isVoid = (element: Element) =>
    element.type === IMAGE ? true : isVoid(element);

  editor.insertData = (data) => {
    const { files } = data;

    if (files && files.length > 0) {
      insertImage(editor, files);
    } else {
      insertData(data);
    }
  };

  editor.deleteBackward = (unit) => {
    const [node] = Editor.nodes(editor, { match: (n) => n.type === IMAGE });

    // Transform into a empty paragraph when trying to delete an image.
    if (node) {
      Transforms.setNodes(editor, { type: PARAGRAPH });
      Transforms.unsetNodes(editor, ['url']);
      return;
    }

    const { beforeText } = getBeforeText(editor);
    const previous = Editor.previous(editor);

    // When the previous element is an image, select it rather than delete it.
    if (previous && previous[0].type === IMAGE && !beforeText) {
      Transforms.deselect(editor);
      return Transforms.select(editor, previous[1]);
    }

    deleteBackward(unit);
  };

  return editor;
};
