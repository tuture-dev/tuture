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

import { IS_FIREFOX } from './environment';
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

const withExplainLayout = (editor: IEditor) => {
  const { deleteBackward } = editor;

  editor.deleteBackward = (unit) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const explainBlock = Editor.above(editor, {
        match: (n) => n.type === EXPLAIN,
      });

      if (explainBlock) {
        const [block, path] = explainBlock;

        // If current explain is empty, forbid to deleteBackward
        if (
          block.children.length === 1 &&
          block.children[0].type === F.PARAGRAPH &&
          !Editor.string(editor, path)
        ) {
          return;
        }
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

export const syncDOMSelection = (editor: IEditor) => {
  const { selection } = editor;
  const domSelection = window.getSelection();

  if (!domSelection) {
    return;
  }

  const newDomRange = selection && ReactEditor.toDOMRange(editor, selection);

  const el = ReactEditor.toDOMNode(editor, editor);
  domSelection.removeAllRanges();

  if (newDomRange) {
    domSelection.addRange(newDomRange!);
  }

  setTimeout(() => {
    // COMPAT: In Firefox, it's not enough to create a range, you also need
    // to focus the contenteditable element too. (2016/11/16)
    if (newDomRange && IS_FIREFOX) {
      el.focus();
    }
  });
};
