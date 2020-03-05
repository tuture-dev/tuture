import { useCallback } from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Editable, useSlate } from 'slate-react';
import { Row, Col, Affix } from 'antd';
import { isBlockActive } from 'editure';
import { Node } from 'slate';
import { CODE_BLOCK } from 'editure-constants';
import refractor from 'refractor';

import Element from './element';
import Leaf from './leaf';
import PageHeader from '../PageHeader';
import StepFileList from '../StepFileList';
import PageCatalogue from '../PageCatalogue';
import { createDropListener } from '../../utils/image';
import { createHotKeysHandler } from '../../utils/hotkeys';
import { getCodeTree, wrapLinesInSpan } from '../Highlight/highlight';

function createDecoration({ path, textStart, textEnd, className }) {
  return {
    anchor: { path, offset: textStart },
    focus: { path, offset: textEnd },
    className,
    codeHighlight: true,
  };
}

function Content() {
  const editor = useSlate();
  const renderElement = useCallback(Element, []);
  const renderLeaf = useCallback(Leaf, []);

  const hotKeyHandler = createHotKeysHandler(editor);
  const dropListener = createDropListener(editor);

  const isCodeBlock = isBlockActive(editor, CODE_BLOCK);

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

      // const defaultCodeValue = [{ type: 'text', value: code }];
    },
    [isCodeBlock],
  );

  return (
    <Row>
      <Col span={0} lg={5}>
        <Affix target={() => document.getElementById('scroll-container')}>
          <PageCatalogue />
        </Affix>
      </Col>
      <Col span={24} lg={19} xl={14}>
        <div
          css={css`
            padding: 48px 60px 64px;

            & .ant-select-selection {
              background: none;
              border: none;
              padding: 2px;
            }

            & .ant-select-selection:active {
              border: none;
              box-shadow: none;
            }

            & .ant-select-selection:focus {
              border: none;
              box-shadow: none;
            }

            & .ant-select-selection-selected-value {
              font-size: 14px;
              font-weight: 400;
            }
          `}
        >
          <PageHeader />
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
        </div>
      </Col>
      <Col span={0} xl={5}>
        <Affix target={() => document.getElementById('scroll-container')}>
          <StepFileList />
        </Affix>
      </Col>
    </Row>
  );
}

export default Content;
