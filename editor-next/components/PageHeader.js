/** @jsx jsx */
import { css, jsx } from '@emotion/core';

function PageHeader() {
  return (
    <div
      css={css`
        border-bottom: 1px solid #e8e8e8;
      `}>
      <h1>PageTitle</h1>
      <p>Page Description</p>
    </div>
  );
}

export default PageHeader;
