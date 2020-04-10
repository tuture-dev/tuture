import React, { useContext } from 'react';
import { useEditure } from 'editure-react';
import { IMAGE } from 'editure-constants';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { IEditor } from 'utils/editor';
import { BLOCK_HOTKEYS, getHotkeyHint, ButtonRefsContext } from 'utils/hotkeys';
import { insertImage } from 'utils/image';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';

const ImageButton = () => {
  const editor = useEditure() as IEditor;
  const { imageBtnRef: ref } = useContext(ButtonRefsContext);
  const { hotkey, title } = BLOCK_HOTKEYS[IMAGE];

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();

    if (e.target.files) {
      insertImage(editor, e.target.files);
    }
  };

  return (
    <Button
      handleMouseDown={(event: React.SyntheticEvent) => {
        event.preventDefault();
        ref.current?.click();
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
      <ToolbarIcon
        icon="icon-image"
        title={`${title}\n${getHotkeyHint(hotkey)}`}
      />
    </Button>
  );
};

export default ImageButton;
