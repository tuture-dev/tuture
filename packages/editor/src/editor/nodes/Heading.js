import { Node } from 'tiptap';
import {
  setBlockType,
  textblockTypeInputRule,
  toggleBlockType,
} from 'tiptap-commands';

export default class Heading extends Node {
  get name() {
    return 'heading';
  }

  get defaultOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
    };
  }

  get schema() {
    return {
      attrs: {
        level: { default: 1 },
        // 每个 heading 都需要确保有 id，使得可以通过 anchor 进行组织和定位
        id: { default: '' },
        // 严格模式不可删除此框
        fixed: { default: false },
        // 有这个字段代表此为一个 step 的 stepTitle 也是 step 的开始
        step: { default: { commit: '' } },
      },
      content: 'inline*',
      group: 'block',
      defining: true,
      draggable: false,
      parseDOM: this.options.levels.map((level) => ({
        tag: `h${level}`,
        attrs: { level },
      })),
      toDOM: (node) => [`h${node.attrs.level}`, 0],
    };
  }

  commands({ type, schema }) {
    return (attrs) => toggleBlockType(type, schema.nodes.paragraph, attrs);
  }

  keys({ type }) {
    return this.options.levels.reduce(
      (items, level) => ({
        ...items,
        ...{
          [`Shift-Ctrl-${level}`]: setBlockType(type, { level }),
        },
      }),
      {},
    );
  }

  inputRules({ type }) {
    return this.options.levels.map((level) =>
      textblockTypeInputRule(new RegExp(`^(#{1,${level}})\\s$`), type, () => ({
        level,
      })),
    );
  }
}