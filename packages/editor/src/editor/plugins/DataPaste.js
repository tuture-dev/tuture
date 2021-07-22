import { Plugin } from 'prosemirror-state';
import { Extension } from 'tiptap';

export default class DataPaste extends Extension {
  get name() {
    return 'data-paste';
  }

  get plugins() {
    return [
      new Plugin({
        props: {
          handlePaste: (view, event) => {
            const text = event.clipboardData.getData('text/plain');
            const html = event.clipboardData.getData('text/html');

            console.log('text', text, html);
            return false;
          },
        },
      }),
    ];
  }
}
