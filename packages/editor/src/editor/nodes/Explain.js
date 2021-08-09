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
      parseDOM: [{ tag: 'div' }],
      toDOM: () => ['div', 0],
    };
  }
}
