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
      `}>
      <PageHeader />
      <PageBody />
    </div>
  );
}

export default Content;
