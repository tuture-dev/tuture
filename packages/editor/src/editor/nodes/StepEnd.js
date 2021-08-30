import { Node } from 'tiptap';

export default class StepEnd extends Node {
  get name() {
    return 'step_end';
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
      },
      toDOM: () => ['div', { class: 'step-end' }, 0],
    };
  }
}
