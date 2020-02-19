import React from 'react';
import { useSlate } from 'slate-react';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';

const HistoryButton = ({ action = 'undo', title, icon }) => {
  const editor = useSlate();

  return (
    <Button
      handleMouseDown={(event) => {
        event.preventDefault();

        if (action === 'redo') {
          editor.redo();
        } else if (action === 'undo') {
          editor.undo();
        }
      }}
    >
      <ToolbarIcon icon={icon} title={title} />
    </Button>
  );
};

export default HistoryButton;
