import { Node } from 'tiptap';

export default class StepStart extends Node {
  get name() {
    return 'step_start';
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
      toDOM: () => ['div', { class: 'step-start' }, 0],
    };
  }
}
