import React from 'react';
import isHotkey from 'is-hotkey';
import { getBeforeText, selectWithinBlock } from 'editure';
import * as F from 'editure-constants';

import { EXPLAIN } from '../utils/constants';
import { IS_MAC } from './getOS';

export function getHotkeyHint(hotkey: string) {
  const keys = hotkey.split('+');

  keys[0] = IS_MAC ? '⌘' : 'Ctrl';

  return keys.map((key) => key[0].toUpperCase() + key.slice(1)).join('+');
}

export const MARK_HOTKEYS = {
  [F.BOLD]: { hotkey: 'mod+b', title: '加粗' },
  [F.ITALIC]: { hotkey: 'mod+i', title: '斜体' },
  [F.UNDERLINE]: { hotkey: 'mod+u', title: '下划线' },
  [F.CODE]: { hotkey: 'ctrl+`', title: '内联代码' },
  [F.LINK]: { hotkey: 'mod+k', title: '链接' },
  [F.STRIKETHROUGH]: { hotkey: 'mod+shift+`', title: '删除线' },
};

export const BLOCK_HOTKEYS = {
  [F.PARAGRAPH]: { hotkey: 'mod+alt+0', title: '正文' },
  [F.H1]: { hotkey: 'mod+alt+1', title: '一级标题' },
  [F.H2]: { hotkey: 'mod+alt+2', title: '二级标题' },
  [F.H3]: { hotkey: 'mod+alt+3', title: '三级标题' },
  [F.H4]: { hotkey: 'mod+alt+1', title: '四级标题' },
  [F.CODE_BLOCK]: { hotkey: 'mod+shift+c', title: '代码块' },
  [F.IMAGE]: { hotkey: 'mod+shift+i', title: '图片' },
  [F.BLOCK_QUOTE]: { hotkey: 'mod+shift+u', title: '引用' },
  [F.BULLETED_LIST]: { hotkey: 'mod+alt+u', title: '有序列表' },
  [F.NUMBERED_LIST]: { hotkey: 'mod+alt+o', title: '无序列表' },
  [F.HR]: { hotkey: 'mod+alt+-', title: '分割线' },
};

export const OP_HOTKEYS = {
  save: { hotkey: 'mod+s', title: '保存' },
  undo: { hotkey: 'mod+z', title: '撤销' },
  redo: { hotkey: 'mod+shift+z', title: '重做' },
};

const containerBlocks = [F.BLOCK_QUOTE, F.CODE_BLOCK, F.NOTE, EXPLAIN];

function handleTabKey(editor: any, event: any) {
  event.preventDefault();

  const { beforeText } = getBeforeText(editor);
  const isInList = !!editor.detectBlockFormat([
    F.BULLETED_LIST,
    F.NUMBERED_LIST,
  ]);

  if (!beforeText.length && isInList) {
    editor.increaseItemDepth();
  } else if (beforeText.length && isInList) {
    editor.insertText('\t');
  } else if (editor.isBlockActive(F.CODE_BLOCK)) {
    editor.insertText('  ');
  } else {
    editor.insertText('\t');
  }
}

function handleShiftTabKey(editor: any, event: any) {
  event.preventDefault();
  if (editor.isBlockActive(F.LIST_ITEM)) {
    editor.decreaseItemDepth();
  }
}

function handleSelectAll(editor: any, event: any) {
  const format = editor.detectBlockFormat(containerBlocks);

  if (format) {
    event.preventDefault();
    selectWithinBlock(editor, format, { how: 'all' });
  }
}

function handleSelectUpperLeftAll(editor: any, event: any) {
  const format = editor.detectBlockFormat(containerBlocks);
  if (format) {
    event.preventDefault();
    selectWithinBlock(editor, format, { how: 'upper-left' });
  }
}

function handleSelectLowerRightAll(editor: any, event: any) {
  const format = editor.detectBlockFormat(containerBlocks);
  if (format) {
    event.preventDefault();
    selectWithinBlock(editor, format, { how: 'lower-right' });
  }
}

function handleExitBlock(editor: any, event: any) {
  const format = editor.detectBlockFormat([
    F.CODE_BLOCK,
    F.BLOCK_QUOTE,
    F.NOTE,
  ]);

  if (format) {
    event.preventDefault();

    selectWithinBlock(editor, format, { how: 'all', collapse: 'end' });
    editor.insertBreak();

    editor.exitBlock(format);
  }
}

// Refs for controlling buttons.
export const buttonRefs = {
  imageBtnRef: React.createRef(),
  linkBtnRef: React.createRef(),
  saveBtnRef: React.createRef(),
};

export const ButtonRefsContext = React.createContext(buttonRefs);

export const createHotKeysHandler = (editor: any) => {
  const { imageBtnRef, linkBtnRef, saveBtnRef }: any = buttonRefs;

  return (event: any) => {
    /* eslint-disable no-restricted-syntax */
    for (const [mark, { hotkey }] of Object.entries(MARK_HOTKEYS)) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault();

        if (mark === F.LINK) {
          linkBtnRef.current.click();
        } else {
          editor.toggleMark(mark);
        }
        return;
      }
    }

    for (const [block, { hotkey }] of Object.entries(BLOCK_HOTKEYS)) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault();

        if (block === F.IMAGE) {
          imageBtnRef.current.click();
        } else {
          editor.toggleBlock(block);
        }
        return;
      }
    }

    if (isHotkey('mod+s', event)) {
      event.preventDefault();
      saveBtnRef.current.click();
    }

    // Logic for selecting all within the current container.
    if (isHotkey('mod+a', event)) {
      handleSelectAll(editor, event);
      return;
    }

    if (isHotkey('mod+shift+up', event)) {
      handleSelectUpperLeftAll(editor, event);
      return;
    }

    if (isHotkey('mod+shift+down', event)) {
      handleSelectLowerRightAll(editor, event);
      return;
    }

    if (isHotkey('mod+enter', event)) {
      handleExitBlock(editor, event);
      return;
    }

    if (isHotkey('shift+tab', event)) {
      handleShiftTabKey(editor, event);
    }

    if (isHotkey('tab', event)) {
      handleTabKey(editor, event);
    }
  };
};
