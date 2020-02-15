import React from 'react';
import { Icon } from 'antd';
import { useSlate } from 'slate-react';
import { insertVoid } from 'editure';
import { HR } from 'editure-constants';

import Button from './Button';

const HrButton = () => {
  const editor = useSlate();

  const onMouseDown = (event) => {
    event.preventDefault();
    insertVoid(editor, HR);
  };

  return (
    <Button title="分割线" handleMouseDown={onMouseDown}>
      <Icon type="line" />
    </Button>
  );
};

export default HrButton;
