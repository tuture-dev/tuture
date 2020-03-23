import React from 'react';
import { useEditure } from 'editure-react';

import { OP_HOTKEYS, getHotkeyHint } from 'utils/hotkeys';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';

const HistoryButton = ({ action, icon }) => {
  const editor = useEditure();
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
