import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

function LastSavedTimestamp() {
  return (
    <div
      css={css`
        margin-left: 16px;
      `}
    >
      最后更改于 今天 20:14
    </div>
  );
}

export default LastSavedTimestamp;
