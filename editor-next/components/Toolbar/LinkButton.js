import React from 'react';
import { Icon } from 'antd';
import { useSlate } from 'slate-react';
import { LINK } from 'editure-constants';
import { isMarkActive, removeLink, getSelectedString } from 'editure';

import Button from './Button';
import { updateLinkText, startEditLink } from '../../utils/link';

const LinkButton = React.forwardRef(({ dispatch }, ref) => {
  const editor = useSlate();

  const onClick = () => {
    const { selection } = editor;
    if (!selection) {
      return;
    }

    if (isMarkActive(editor, LINK)) {
      return removeLink(editor);
    }

    dispatch(updateLinkText(getSelectedString(editor)));
    dispatch(startEditLink());
  };

  return (
    <Button
      title="添加链接"
      active={isMarkActive(editor, LINK)}
      handleClick={onClick}
      ref={ref}
    >
      <Icon type="link" />
    </Button>
  );
});

export default LinkButton;
