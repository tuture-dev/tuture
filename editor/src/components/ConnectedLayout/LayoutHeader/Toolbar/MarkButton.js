import React from 'react';
import { useEditure } from 'editure-react';

import { MARK_HOTKEYS, getHotkeyHint } from 'utils/hotkeys';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';

const MarkButton = ({ format, icon }) => {
  const editor = useEditure();
  const isActive = editor.isMarkActive(format);
  const { hotkey, title } = MARK_HOTKEYS[format];

  return (
    <Button
      handleMouseDown={(event) => {
        event.preventDefault();
        editor.toggleMark(format);
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
