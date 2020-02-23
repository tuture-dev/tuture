import React, { useCallback } from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Editable, useSlate } from 'slate-react';
import { Row, Col, Affix } from 'antd';

import Element from './element';
import Leaf from './leaf';
import PageHeader from '../PageHeader';
import StepFileList from '../StepFileList';
import PageCatalogue from '../PageCatalogue';
import { createDropListener } from '../../utils/image';
import { createHotKeysHandler } from '../../utils/hotkeys';

function Content() {
  const editor = useSlate();
  const renderElement = useCallback(Element, []);
  const renderLeaf = useCallback(Leaf, []);

  const hotKeyHandler = createHotKeysHandler(editor);
  const dropListener = createDropListener(editor);

  return (
    <Row
      css={css`
        & textarea {
          font-family: 'Roboto', 'Ubuntu Mono', Consolas, monospace;
          line-height: 1.4;
          background: #eee;
        }
        & input {
          font-family: 'Roboto', 'Ubuntu Mono', Consolas, monospace;
          line-height: 1.4;
          box-sizing: border-box;
          font-size: 0.85em;
          width: 100%;
          padding: 0.5em;
          border: 2px solid #ddd;
          background: #fafafa;
        }

        & input:focus {
          outline: 0;
          border-color: blue;
        }
      `}
    >
      <Col span={0} lg={5}>
        <Affix offsetTop={64}>
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
        <Affix offsetTop={64}>
          <StepFileList />
        </Affix>
      </Col>
    </Row>
  );
}

export default Content;
