import React from 'react';
import { useEditure } from 'editure-react';
import { HR } from 'editure-constants';

import { IEditor } from 'utils/editor';
import { BLOCK_HOTKEYS, getHotkeyHint } from 'utils/hotkeys';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';

const HrButton = () => {
  const editor = useEditure() as IEditor;
  const { hotkey, title } = BLOCK_HOTKEYS[HR];

  const onMouseDown = (event: React.SyntheticEvent) => {
    event.preventDefault();
    editor.insertVoid(HR);
  };

  return (
    <Button handleMouseDown={onMouseDown}>
      <ToolbarIcon
        icon="icon-line"
        title={`${title}\n${getHotkeyHint(hotkey)}`}
      />
    </Button>
  );
};

export default HrButton;
