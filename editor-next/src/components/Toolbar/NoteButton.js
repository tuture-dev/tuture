import React from 'react';
import { Dropdown, Menu } from 'antd';
import { useSlate } from 'slate-react';
import { toggleBlock } from 'editure';
import { NOTE } from 'editure-constants';

import Button from './Button';
import IconFont from '../IconFont';
import ToolbarIcon from './ToolbarIcon';
import { levels } from '../Content/element/Note';

const NoteButton = () => {
  const editor = useSlate();

  const handleClick = (e) => {
    toggleBlock(editor, NOTE, { level: e.key }, { unwrap: true });
  };

  const menu = (
    <Menu onClick={handleClick}>
      {Object.keys(levels).map((level) => (
        <Menu.Item key={level}>
          <IconFont type={`icon-note-${level}`} />
          <span>{levels[level].name}</span>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomCenter">
      <Button>
        <ToolbarIcon icon="icon-hint" title="提示框" />
      </Button>
    </Dropdown>
  );
};

export default NoteButton;
