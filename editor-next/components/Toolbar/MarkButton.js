import React from 'react';
import { Icon } from 'antd';
import { useSlate } from 'slate-react';
import { isMarkActive, toggleMark } from 'editure';

import Button from './Button';

const MarkButton = ({ format = '', icon, title }) => {
  const editor = useSlate();

  return (
    <Button
      title={title}
      active={isMarkActive(editor, format)}
      handleMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon type={icon} />
    </Button>
  );
};

export default MarkButton;
