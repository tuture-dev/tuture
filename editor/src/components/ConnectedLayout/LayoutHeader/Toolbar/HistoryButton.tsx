import React from 'react';
import { useEditure } from 'editure-react';

import { IEditor } from 'utils/editor';
import { OP_HOTKEYS, getHotkeyHint } from 'utils/hotkeys';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';

type HistoryButtonProps = {
  action: 'undo' | 'redo';
  icon: string;
};

const HistoryButton = ({ action, icon }: HistoryButtonProps) => {
  const editor = useEditure() as IEditor;
  const { hotkey, title } = OP_HOTKEYS[action];

  return (
    <Button
      handleMouseDown={(event: React.SyntheticEvent) => {
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
