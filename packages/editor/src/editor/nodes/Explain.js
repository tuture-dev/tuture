import { Node } from 'tiptap';
import { keymap } from 'prosemirror-keymap';
import { findParentNode } from 'prosemirror-utils';
import {
  splitBlock,
  liftEmptyBlock,
  chainCommands,
} from 'prosemirror-commands';

export default class Explain extends Node {
  get name() {
    return 'explain';
  }

  get schema() {
    return {
      content: 'block+',
      group: 'block',
      defining: true,
      draggable: false,
      attrs: {
        // 严格模式不可删除此框
        fixed: { default: false },
        // 解释所处级别，'step' | 'file'
        level: { default: '' },
        // pos = 'pre' | 'post'，标志是前置解释还是后置解释
        pos: { default: '' },
        // 所处提交 hash
        commit: { default: '' },
        // 所处 file 名称
        file: { default: '' },
        // 是否过时（所属 commit 是否已不存在）
        outdated: { default: false },
      },
      parseDOM: [{ tag: 'div' }],
      toDOM: () => ['div', { class: 'explain' }, 0],
    };
  }

  get plugins() {
    return [
      keymap({
        Enter: (state, dispatch, view) => {
          const $from = state.selection.$from;
          const isTopLevel = $from.depth === 1;

          // 直接父块
          const directParent = findParentNode((node) => {
            return node.isBlock;
          })(state.selection);

          if (
            !directParent ||
            (directParent && directParent.node.type.name !== 'paragraph')
          )
            return false;

          const isEmpty = directParent.node.content.size === 0;

          let secondUpperParent;

          if (!isTopLevel) {
            const node = $from.node($from.depth - 1);
            secondUpperParent = {
              pos: $from.before($from.depth - 1),
              start: $from.start($from.depth - 1),
              depth: $from.depth - 1,
              node,
            };
          }

          if (
            !secondUpperParent ||
            (secondUpperParent &&
              secondUpperParent.node.type.name !== 'explain')
          )
            return false;

          if (isEmpty) {
            splitBlock(state, dispatch, view);
            return true;
          }

          return false;
        },
      }),
    ];
  }
}
