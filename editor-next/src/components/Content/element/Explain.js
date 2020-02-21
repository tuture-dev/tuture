import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

function ExplainElement(props) {
  const { attributes, children } = props;

  return (
    <div
      {...attributes}
      css={css`
        margin: 3px;
        padding: 3px;
        border: 1px solid white;

        &:hover {
          border: 1px solid #ddd;
        }
      `}
    >
      {children}
    </div>
  );
}

export default ExplainElement;
