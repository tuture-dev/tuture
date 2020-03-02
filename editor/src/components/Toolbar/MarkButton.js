import React from 'react';
import { useSlate } from 'slate-react';
import { isMarkActive, toggleMark } from 'editure';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';
import { MARK_HOTKEYS, getHotkeyHint } from '../../utils/hotkeys';

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  const isActive = isMarkActive(editor, format);
  const { hotkey, title } = MARK_HOTKEYS[format];

  return (
    <Button
      handleMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <ToolbarIcon
        isActive={isActive}
        icon={icon}
        title={`${title}\n${getHotkeyHint(hotkey)}`}
      />
    </Button>
  );
};

export default MarkButton;
