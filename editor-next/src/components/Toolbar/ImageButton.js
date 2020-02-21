import React, { useContext } from 'react';
import { useSlate } from 'slate-react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';
import { ButtonRefsContext } from '../../utils/hotkeys';
import { uploadImage, createInsertImageCallback } from '../../utils/image';

const ImageButton = () => {
  const editor = useSlate();
  const { imageBtnRef: ref } = useContext(ButtonRefsContext);

  const onChange = (e) => {
    e.persist();
    uploadImage(e.target.files[0], createInsertImageCallback(editor));
  };

  return (
    <Button
      handleMouseDown={(event) => {
        event.preventDefault();

        ref.current.click();
      }}
    >
      <input
        type="file"
        ref={ref}
        onChange={onChange}
        css={css`
          position: absolute;
          z-index: -1;
          left: 0;
          top: 0;
          width: 0;
          height: 0;
          opacity: 0;
        `}
      />
      <ToolbarIcon icon="icon-image" title="图片" />
    </Button>
  );
};

export default ImageButton;
