import {
  createEditor,
  defaultPlugins,
  withHistory,
  Transforms,
  Range,
  Editor,
} from 'editure';
import { withPaste, withReact } from 'editure-react';
import * as F from 'editure-constants';

import { withImages } from './image';
import { EXPLAIN, DIFF_BLOCK } from '../utils/constants';

const withCommitHeaderLayout = (editor: any) => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]: [any, string]) => {
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

const withExplainLayout = (editor: any) => {
  const { deleteBackward } = editor;

  editor.deleteBackward = (...args: any) => {
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

const withDiffBlockVoid = (editor: any) => {
  const { isVoid } = editor;

  editor.isVoid = (element: any) => {
    return element.type === DIFF_BLOCK ? true : isVoid(element);
  };

  return editor;
};

const plugins = [
  withReact,
  withImages,
  ...defaultPlugins,
  withExplainLayout,
  withCommitHeaderLayout,
  withDiffBlockVoid,
  withPaste,
  withHistory,
];

export const initializeEditor = () =>
  plugins.reduce(
    (augmentedEditor, plugin) => plugin(augmentedEditor),
    createEditor(),
  );
