import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useSlate } from 'slate-react';
import { LINK } from 'editure-constants';
import { isMarkActive, removeLink, getSelectedString } from 'editure';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';
import { ButtonRefsContext } from '../../utils/hotkeys';

const LinkButton = () => {
  const editor = useSlate();
  const dispatch = useDispatch();
  const { linkBtnRef: ref } = useContext(ButtonRefsContext);

  const isActive = isMarkActive(editor, LINK);

  const onClick = () => {
    const { selection } = editor;
    if (!selection) {
      return;
    }

    if (isMarkActive(editor, LINK)) {
      return removeLink(editor);
    }

    dispatch.link.setText(getSelectedString(editor));
    dispatch.link.startEdit();
  };

  return (
    <Button handleClick={onClick} ref={ref}>
      <ToolbarIcon isActive={isActive} icon="icon-link" title="链接" />
    </Button>
  );
};

export default LinkButton;
