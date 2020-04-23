import { Spin, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { Transforms, Node } from 'editure';
import { IMAGE } from 'editure-constants';
import { useFocused, useSelected, useEditure } from 'editure-react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ElementProps } from './index';
import { uploadImage } from 'utils/image';
import { IEditor } from 'utils/editor';

function ImageElement(props: ElementProps) {
  const { attributes, children, element } = props;
  const { url, file } = element;

  const editor = useEditure() as IEditor;
  const selected = useSelected();
  const focused = useFocused();

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url.startsWith('data:image')) {
      setUploading(true);

      uploadImage(file, (err, hostingUrl) => {
        setUploading(false);

        if (err) {
          return message.error('图片上传失败！');
        }

        for (const [node, path] of Node.nodes(editor, { reverse: true })) {
          if (node.type === IMAGE && node.url === url) {
            Transforms.setNodes(editor, { url: hostingUrl }, { at: path });
            Transforms.unsetNodes(editor, ['file'], { at: path });
            break;
          }
        }
      });
    }
  }, [editor, file, url]);

  return (
    <Spin tip="上传中..." spinning={uploading}>
      <div {...attributes}>
        <div contentEditable={false}>
          <img
            src={url}
            alt=""
            css={css`
              display: block;
              cursor: pointer;
              margin-left: auto;
              margin-right: auto;
              max-width: 100%;
              max-height: 20em;
              box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
            `}
          />
        </div>
        {children}
      </div>
    </Spin>
  );
}

export default ImageElement;
