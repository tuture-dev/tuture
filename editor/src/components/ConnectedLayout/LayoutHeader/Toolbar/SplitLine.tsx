import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const SplitLine = () => {
  return (
    <span
      css={css`
        margin: 0 1px;
        color: #e8e8e8;
        font-size: large;
        font-weight: 100;
      `}
    >
      |
    </span>
  );
};

export default SplitLine;
