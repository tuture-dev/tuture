import React from 'react';
import { Icon } from 'antd';
import { useSlate } from 'slate-react';
import { css } from 'emotion';

import Button from './Button';
import { uploadImage, createInsertImageCallback } from '../../utils/image';

const ImageButton = React.forwardRef((_, ref) => {
  const editor = useSlate();

  const onChange = (e) => {
    e.persist();
    uploadImage(e.target.files[0], createInsertImageCallback(editor));
  };

  return (
    <Button
      title="图片"
      handleMouseDown={(event) => {
        event.preventDefault();

        ref.current.click();
      }}>
      <input
        type="file"
        ref={ref}
        onChange={onChange}
        className={css`
          position: absolute;
          z-index: -1;
          left: 0;
          top: 0;
          width: 0;
          height: 0;
          opacity: 0;
        `}
      />
      <Icon type="file-image" />
    </Button>
  );
});

export default ImageButton;
