import { Node } from 'tiptap';

export default class FileEnd extends Node {
  get name() {
    return 'file_end';
  }

  get schema() {
    return {
      content: '',
      group: 'block',
      defining: true,
      selectable: false,
      draggable: false,
      editable: false,
      attrs: {
        commit: { default: '' },
        file: { default: '' },
      },
      toDOM: () => ['div', { class: 'file-end' }, 0],
    };
  }
}
