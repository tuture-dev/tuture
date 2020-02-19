import { useCallback } from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Editable, useSlate } from 'slate-react';

import Element from './element';
import Leaf from './leaf';
import PageHeader from '../PageHeader';
import { createDropListener } from '../../utils/image';
import { createHotKeysHandler } from '../../utils/hotkeys';

function Content() {
  const editor = useSlate();
  const renderElement = useCallback(Element, []);
  const renderLeaf = useCallback(Leaf, []);

  const hotKeyHandler = createHotKeysHandler(editor);
  const dropListener = createDropListener(editor);

  return (
    <div
      css={css`
        height: calc(100vh - 64px);
        overflow-y: scroll;
        padding: 48px 60px 64px;
      `}
      id="scroll-container"
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
  );
}

export default Content;
