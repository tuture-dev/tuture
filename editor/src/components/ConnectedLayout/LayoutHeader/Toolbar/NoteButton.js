import React from 'react';
import { Dropdown, Menu } from 'antd';
import { useSlate } from 'tuture-slate-react';
import { toggleBlock } from 'editure';
import { NOTE } from 'editure-constants';

import { levels } from 'utils/note';
import IconFont from 'components/IconFont';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';

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
