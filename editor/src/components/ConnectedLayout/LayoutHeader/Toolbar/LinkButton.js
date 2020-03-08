import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useSlate } from 'tuture-slate-react';
import { LINK } from 'editure-constants';
import { isMarkActive, removeLink, getSelectedString } from 'editure';

import { MARK_HOTKEYS, getHotkeyHint, ButtonRefsContext } from 'utils/hotkeys';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';

const LinkButton = () => {
  const editor = useSlate();
  const dispatch = useDispatch();
  const { linkBtnRef: ref } = useContext(ButtonRefsContext);
  const { hotkey, title } = MARK_HOTKEYS[LINK];

  const isActive = isMarkActive(editor, LINK);

  const onClick = () => {
    const { selection } = editor;
    if (!selection) {
      return;
    }

    if (isMarkActive(editor, LINK)) {
      return removeLink(editor);
    }

    dispatch({ type: 'link/setText', payload: getSelectedString(editor) });
    dispatch({ type: 'link/startEdit' });
  };

  return (
    <Button handleClick={onClick} ref={ref}>
      <ToolbarIcon
        isActive={isActive}
        icon="icon-link"
        title={`${title}\n${getHotkeyHint(hotkey)}`}
      />
    </Button>
  );
};

export default LinkButton;
