import { useCallback } from 'react';

/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Editable, useSlate } from 'tuture-slate-react';
import { useSelector } from 'react-redux';
import { Node } from 'slate';
import refractor from 'refractor';

import { createDropListener } from 'utils/image';
import { createHotKeysHandler } from 'utils/hotkeys';

import Element from './element';
import Leaf from './leaf';
import { getCodeTree, wrapLinesInSpan } from '../Highlight/highlight';

function createDecoration({ path, textStart, textEnd, className }) {
  return {
    anchor: { path, offset: textStart },
    focus: { path, offset: textEnd },
    className,
    codeHighlight: true,
  };
}

function Editure() {
  const editor = useSlate();
  const lang = useSelector((state) => state.slate.lang);

  const renderElement = useCallback(Element, [lang]);
  const renderLeaf = useCallback(Leaf, [lang]);

  const hotKeyHandler = createHotKeysHandler(editor);
  const dropListener = createDropListener(editor);

  const decorate = useCallback(
    ([node, path]) => {
      const ranges = [];

      const grammarName = node.lang;
      if (!grammarName) {
        return ranges;
      }

      let codeStr = '';

      const textIter = Node.texts(node);
      for (let textNode of textIter) {
        const { text } = textNode[0];
        codeStr += `${text}\n`;
      }

      const defaultCodeValue = [{ type: 'text', value: codeStr }];
      const codeTree = getCodeTree({
        astGenerator: refractor,
        language: grammarName,
        code: codeStr,
        defaultCodeValue,
      });

      const tree = wrapLinesInSpan(codeTree).slice(0, -1);

      tree.forEach((codeStrLine, lineIndex) => {
        let textStart = 0;
        let textEnd = 0;

        codeStrLine.children.forEach((codeStrToken) => {
          const { type } = codeStrToken;
          let text = '';

          if (type === 'text') {
            text = codeStrToken?.value || '';
          } else {
            text = codeStrToken?.children[0]?.value || '';
          }

          const className = codeStrToken?.properties?.className || [];

          textEnd = textStart + text.length;

          const decoration = createDecoration({
            path: [...path, lineIndex],
            textStart,
            textEnd,
            className,
          });

          ranges.push(decoration);
          textStart = textEnd;
        });
      });

      return ranges;
    },
    [lang],
  );

  return (
    <Editable
      placeholder="Enter something ..."
      decorate={decorate}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      onKeyDown={hotKeyHandler}
      onDrop={dropListener}
      onCopy={(e) => {
        e.clipboardData.setData('application/x-editure-fragment', true);
      }}
    />
  );
}

export default Editure;
