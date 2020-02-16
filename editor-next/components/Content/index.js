import { useCallback } from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Editable } from 'slate-react';

import Element from './element';
import Leaf from './leaf';
import PageHeader from '../PageHeader';

function Content() {
  const renderElement = useCallback(Element, []);
  const renderLeaf = useCallback(Leaf, []);

  return (
    <div
      css={css`
        height: calc(100vh - 64px);
        overflow-y: scroll;
        padding: 48px 60px 64px;
      `}
    >
      <PageHeader />
      <Editable
        placeholder="Enter something ..."
        renderElement={renderElement}
        renderLeaf={renderLeaf}
      />
    </div>
  );
}

export default Content;
