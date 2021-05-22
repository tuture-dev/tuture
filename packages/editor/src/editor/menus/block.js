import { IS_MAC } from '../utils/environment';

const mod = IS_MAC ? '⌘' : 'ctrl';

export default function blockMenuItems(dictionary) {
  return [
    {
      name: 'heading',
      title: dictionary.h1,
      keywords: 'h1 heading1 title',
      icon: 'heading',
      shortcut: '^ ⇧ 1',
      attrs: { level: 1 },
    },
    {
      name: 'heading',
      title: dictionary.h2,
      keywords: 'h2 heading2',
      icon: 'heading',
      shortcut: '^ ⇧ 2',
      attrs: { level: 2 },
    },
    {
      name: 'heading',
      title: dictionary.h3,
      keywords: 'h3 heading3',
      icon: 'heading',
      shortcut: '^ ⇧ 3',
      attrs: { level: 3 },
    },
    {
      name: 'separator',
    },
    {
      name: 'todo_list',
      title: dictionary.checkboxList,
      icon: 'check',
      keywords: 'checklist checkbox task',
      shortcut: '^ ⇧ 7',
    },
    {
      name: 'bullet_list',
      title: dictionary.bulletList,
      icon: 'list-ul',
      shortcut: '^ ⇧ 8',
    },
    {
      name: 'ordered_list',
      title: dictionary.orderedList,
      icon: 'list-ol',
      shortcut: '^ ⇧ 9',
    },
    {
      name: 'separator',
    },
    {
      name: 'table',
      title: dictionary.table,
      icon: 'table',
      attrs: { rowsCount: 3, colsCount: 3 },
    },
    {
      name: 'blockquote',
      title: dictionary.quote,
      icon: 'quote-left',
      shortcut: `${mod} ]`,
    },
    {
      name: 'code_block',
      title: dictionary.codeBlock,
      icon: 'file-code',
      shortcut: '^ ⇧ \\',
      keywords: 'script',
    },
    {
      name: 'horizontal_rule',
      title: dictionary.hr,
      icon: 'grip-horizontal',
      shortcut: `${mod} _`,
      keywords: 'horizontal rule break line',
    },
    {
      name: 'image',
      title: dictionary.image,
      icon: 'image',
      keywords: 'picture photo',
    },
    {
      name: 'link',
      title: dictionary.link,
      icon: 'link',
      shortcut: `${mod} k`,
      keywords: 'link url uri href',
    },
    {
      name: 'separator',
    },
    {
      name: 'diff_block',
      title: dictionary.diffBlock,
      icon: 'tint',
      keywords: 'container_notice card information',
    },
    {
      name: 'notice',
      title: dictionary.default,
      icon: 'tint',
      keywords: 'container_notice card information',
      attrs: { style: 'default' },
    },
  ];
}
