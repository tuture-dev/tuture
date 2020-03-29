import React, { useCallback } from 'react';

/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Node, Path, Point } from 'editure';
import { Editable, useEditure } from 'editure-react';
import { useSelector } from 'react-redux';
import { AST } from 'refractor';

import { RootState } from 'store';
import { createDropListener } from 'utils/image';
import { createHotKeysHandler } from 'utils/hotkeys';

import Element from './element';
import Leaf from './leaf';
import { getCodeTree, wrapLinesInSpan } from '../Highlight/highlight';

interface Decoration {
  anchor: Point;
  focus: Point;
  className: string[];
  codeHighlight: boolean;
}

function createDecoration(props: {
  path: Path;
  textStart: number;
  textEnd: number;
  className: string[];
}): Decoration {
  const { path, textStart, textEnd, className } = props;

  return {
    anchor: { path, offset: textStart },
    focus: { path, offset: textEnd },
    className,
    codeHighlight: true,
  };
}

function Editure() {
  const editor = useEditure();
  const lang = useSelector<RootState, string>((state) => state.slate.lang);

  const renderElement = useCallback(Element, [lang]);
  const renderLeaf = useCallback(Leaf, [lang]);

  const hotKeyHandler = createHotKeysHandler(editor);
  const dropListener = createDropListener(editor);

  const decorate = useCallback(
    ([node, path]) => {
      const ranges: Decoration[] = [];

      const lang = node.lang;
      if (!lang) {
        return ranges;
      }

      let code = '';

      for (let textNode of Node.texts(node)) {
        const { text } = textNode[0];
        code += `${text}\n`;
      }

      const codeTree = getCodeTree(code, lang);
      const tree = wrapLinesInSpan(codeTree).slice(0, -1);

      tree.forEach((codeStrLine, lineIndex) => {
        let textStart = 0;
        let textEnd = 0;

        codeStrLine.children.forEach((codeStrToken) => {
          let text = '';

          if (codeStrToken.type === 'text') {
            text = codeStrToken.value || '';
          } else {
            text = (codeStrToken.children[0] as AST.Text)?.value || '';
          }

          const className =
            (codeStrToken as AST.Element)?.properties?.className || [];

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
        e.clipboardData.setData(
          'application/x-editure-fragment',
          JSON.stringify(true),
        );
      }}
    />
  );
}

export default Editure;
