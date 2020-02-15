import React from 'react';
import { Icon } from 'antd';
import { useSlate } from 'slate-react';
import { isBlockActive, toggleBlock } from 'editure';

import Button from './Button';

const BlockButton = ({ format = '', title, icon }) => {
  const editor = useSlate();

  return (
    <Button
      title={title}
      active={isBlockActive(editor, format)}
      handleMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format, {}, { unwrap: true });
      }}>
      <Icon type={icon} />
    </Button>
  );
};

export default BlockButton;
