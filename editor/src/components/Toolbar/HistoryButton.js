import React from 'react';
import { useSlate } from 'slate-react';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';
import { OP_HOTKEYS, getHotkeyHint } from '../../utils/hotkeys';

const HistoryButton = ({ action, icon }) => {
  const editor = useSlate();
  const { hotkey, title } = OP_HOTKEYS[action];

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
      <ToolbarIcon icon={icon} title={`${title}\n${getHotkeyHint(hotkey)}`} />
    </Button>
  );
};

export default HistoryButton;
