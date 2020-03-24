import React from 'react';
import { useEditure } from 'editure-react';

import { BLOCK_HOTKEYS, getHotkeyHint } from 'utils/hotkeys';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';

const BlockButton = ({ format, icon }) => {
  const editor = useEditure();
  const isActive = editor.isBlockActive(format);
  const { hotkey, title } = BLOCK_HOTKEYS[format];

  return (
    <Button
      handleMouseDown={(event) => {
        event.preventDefault();
        editor.toggleBlock(format);
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

export default BlockButton;
