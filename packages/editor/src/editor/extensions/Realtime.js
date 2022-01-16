import { keymap } from 'prosemirror-keymap';
import { Extension } from 'tiptap';
import {
  redo,
  undo,
  yCursorPlugin,
  ySyncPlugin,
  yUndoPlugin,
} from 'y-prosemirror';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

export default class RealtimeExtension extends Extension {
  get name() {
    return 'realtime';
  }

  get plugins() {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      `ws://${window.location.hostname}`,
      'tiptap-demo',
      ydoc,
    );
    const type = ydoc.getXmlFragment('prosemirror');
    return [
      ySyncPlugin(type),
      yCursorPlugin(provider.awareness),
      yUndoPlugin(),
      keymap({
        'Mod-z': undo,
        'Mod-y': redo,
        'Mod-Shift-z': redo,
      }),
    ];
  }
}
