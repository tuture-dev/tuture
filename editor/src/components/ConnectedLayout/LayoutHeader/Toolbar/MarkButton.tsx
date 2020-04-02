import React from 'react';
import { useEditure } from 'editure-react';

import { IEditor } from 'utils/editor';
import { MARK_HOTKEYS, getHotkeyHint } from 'utils/hotkeys';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';

type MarkButtonProps = {
  format: string;
  icon: string;
};

const MarkButton = ({ format, icon }: MarkButtonProps) => {
  const editor = useEditure() as IEditor;
  const isActive = editor.isMarkActive(format);
  const { hotkey, title } = MARK_HOTKEYS[format];

  return (
    <Button
      handleMouseDown={(event: React.SyntheticEvent) => {
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
