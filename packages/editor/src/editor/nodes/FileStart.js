import { Node } from 'tiptap';

export default class FileStart extends Node {
  get name() {
    return 'file_start';
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
      toDOM: () => ['div', { class: 'file-start' }, 0],
    };
  }
}
