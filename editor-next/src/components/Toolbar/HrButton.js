import React from 'react';
import { useSlate } from 'slate-react';
import { insertVoid } from 'editure';
import { HR } from 'editure-constants';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';

const HrButton = () => {
  const editor = useSlate();

  const onMouseDown = (event) => {
    event.preventDefault();
    insertVoid(editor, HR);
  };

  return (
    <Button handleMouseDown={onMouseDown}>
      <ToolbarIcon icon="icon-line" title="分割线" />
    </Button>
  );
};

export default HrButton;
