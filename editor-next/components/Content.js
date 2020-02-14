/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import PageHeader from './PageHeader';
import PageBody from './PageBody';

function Content() {
  return (
    <div
      css={css`
        height: calc(100vh - 64px);
        overflow-y: scroll;
        padding: 48px 60px 64px;
      `}>
      <PageHeader />
      <PageBody />
    </div>
  );
}

export default Content;
