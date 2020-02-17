import React from 'react';
import { useSlate } from 'slate-react';
import { isMarkActive, toggleMark } from 'editure';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';

const MarkButton = ({ format = '', icon, title }) => {
  const editor = useSlate();
  const isActive = isMarkActive(editor, format);

  return (
    <Button
      title={title}
      handleMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <ToolbarIcon isActive={isActive} icon={icon} />
    </Button>
  );
};

export default MarkButton;
