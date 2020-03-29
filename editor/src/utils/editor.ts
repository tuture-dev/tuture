import {
  createEditor,
  defaultPlugins,
  withHistory,
  Transforms,
  Range,
  Editor,
  EditorWithBlock,
  EditorWithMark,
  EditorWithVoid,
  EditorWithContainer,
} from 'editure';
import { withPaste, withReact, ReactEditor } from 'editure-react';
import * as F from 'editure-constants';

import { withImages } from './image';
import { EXPLAIN, DIFF_BLOCK } from '../utils/constants';

const withCommitHeaderLayout = (editor: Editor) => {
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

const withExplainLayout = (editor: Editor) => {
  const { deleteBackward } = editor;

  editor.deleteBackward = (unit) => {
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

    deleteBackward(unit);
  };

  return editor;
};

const withDiffBlockVoid = (editor: Editor) => {
  const { isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === DIFF_BLOCK ? true : isVoid(element);
  };

  return editor;
};

const plugins: Function[] = [
  withReact,
  withImages,
  ...defaultPlugins,
  withExplainLayout,
  withCommitHeaderLayout,
  withDiffBlockVoid,
  withPaste,
  withHistory,
];

export type IEditor = Editor &
  EditorWithVoid &
  EditorWithBlock &
  EditorWithMark &
  EditorWithContainer &
  ReactEditor;

export const initializeEditor = () =>
  plugins.reduce(
    (augmentedEditor, plugin) => plugin(augmentedEditor),
    createEditor() as IEditor,
  ) as IEditor;
