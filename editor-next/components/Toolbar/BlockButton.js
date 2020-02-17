import React from 'react';
import { useSlate } from 'slate-react';
import { isBlockActive, toggleBlock } from 'editure';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';

const BlockButton = ({ format = '', title, icon }) => {
  const editor = useSlate();
  const isActive = isBlockActive(editor, format);

  return (
    <Button
      title={title}
      handleMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format, {}, { unwrap: true });
      }}
    >
      <ToolbarIcon isActive={isActive} icon={icon} />
    </Button>
  );
};

export default BlockButton;
