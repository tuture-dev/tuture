import { Node } from 'tiptap';

import DiffView from '../components/DiffView.vue';

export default class DiffBlock extends Node {
  get name() {
    return 'diff_block';
  }

  get view() {
    return DiffView;
  }

  get schema() {
    return {
      attrs: {
        // 对应着 fileId，标志某个 file 级别的解释
        id: { default: '' },
        // 原 diff_block 相关的信息
        file: { default: '' },
        commit: { default: '' },
        hiddenLines: { default: [] },
      },
      content: 'text*',
      marks: '',
      group: 'block',
      code: true,
      defining: true,
      draggable: false,
      toDOM: () => ['div'],
    };
  }

  commands({ type }) {
    return (attrs) => (state, dispatch) => {
      const { selection } = state;
      const position = selection.$cursor
        ? selection.$cursor.pos
        : selection.$to.pos;

      const node = type.create(attrs);
      const transaction = state.tr.insert(position, node);
      dispatch(transaction);
    };
  }
}
