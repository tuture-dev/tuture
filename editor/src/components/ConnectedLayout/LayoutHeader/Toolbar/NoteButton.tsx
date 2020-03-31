import React from 'react';
import { Dropdown, Menu } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import { useEditure } from 'editure-react';
import { NOTE } from 'editure-constants';

import { IEditor } from 'utils/editor';
import { levels } from 'utils/note';
import IconFont from 'components/IconFont';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';

const NoteButton = () => {
  const editor = useEditure() as IEditor;

  const handleClick = (e: ClickParam) => {
    editor.toggleBlock(NOTE, { level: e.key });
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
