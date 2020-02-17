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
    <Button title="分割线" handleMouseDown={onMouseDown}>
      <ToolbarIcon icon="icon-line" />
    </Button>
  );
};

export default HrButton;
