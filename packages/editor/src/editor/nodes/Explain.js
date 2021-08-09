import { Node } from 'tiptap';

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
      },
      parseDOM: [{ tag: 'div' }],
      toDOM: () => ['div', 0],
    };
  }
}
