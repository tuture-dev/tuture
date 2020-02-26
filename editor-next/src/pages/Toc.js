/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import TocComponent from '../components/Toc';

function Toc() {
  return (
    <div
      css={css`
        height: calc(100vh - 64px);
        width: 100%;
        background: #f7f7fa;
        padding-top: 24px;
      `}
    >
      <TocComponent />
    </div>
  );
}

export default Toc;
