import React from 'react';
import { useSlate } from 'tuture-slate-react';
import { insertVoid } from 'editure';
import { HR } from 'editure-constants';

import { BLOCK_HOTKEYS, getHotkeyHint } from 'utils/hotkeys';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';

const HrButton = () => {
  const editor = useSlate();
  const { hotkey, title } = BLOCK_HOTKEYS[HR];

  const onMouseDown = (event) => {
    event.preventDefault();
    insertVoid(editor, HR);
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
