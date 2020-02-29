import { createEditor, Transforms, Range, Editor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { defaultPlugins } from 'editure';
import * as F from 'editure-constants';

import { withImages } from './image';
import { EXPLAIN } from '../utils/constants';

const withCommitHeaderLayout = (editor) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 1 && node.fixed) {
      if (node.type === F.PARAGRAPH) {
        const title = { type: F.H2, children: [{ text: '' }] };
        Transforms.setNodes(editor, title);
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
};

const withExplainLayout = (editor) => {
  const { deleteBackward } = editor;

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    // If selection is start of EXPLAIN, forbid to deleteBackward
    if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, {
        match: (n) => n.type === EXPLAIN,
      });

      if (match && Editor.isStart(editor, selection.anchor, match[1])) {
        return;
      }
    }

    deleteBackward(...args);
  };

  return editor;
};

const plugins = [
  withReact,
  withHistory,
  withExplainLayout,
  withImages,
  ...defaultPlugins,
  withCommitHeaderLayout,
];

export const initializeEditor = () =>
  plugins.reduce(
    (augmentedEditor, plugin) => plugin(augmentedEditor),
    createEditor(),
  );
