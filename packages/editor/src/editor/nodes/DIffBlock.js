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
        filename: '',
        commit: '',
        language: '',
        code: '',
        originalCode: '',
        splitDiff: false,
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
    return {
      insertDiff: (attrs) => (state, dispatch) => {
        const { selection } = state;
        const position = selection.$cursor
          ? selection.$cursor.pos
          : selection.$to.pos;
        const node = type.create(attrs);
        const transaction = state.tr.insert(position, node);
        dispatch(transaction);
      },
    };
  }
}
