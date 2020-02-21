import React from 'react';
import { css } from 'emotion';

const SplitLine = () => {
  return (
    <span
      className={css`
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
