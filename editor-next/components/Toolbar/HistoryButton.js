import React from 'react';
import { Icon } from 'antd';
import { useSlate } from 'slate-react';

import Button from './Button';

const HistoryButton = ({ action = 'undo', title, icon }) => {
  const editor = useSlate();

  return (
    <Button
      title={title}
      handleMouseDown={(event) => {
        event.preventDefault();

        if (action === 'redo') {
          editor.redo();
        } else if (action === 'undo') {
          editor.undo();
        }
      }}>
      <Icon type={icon} />
    </Button>
  );
};

export default HistoryButton;
