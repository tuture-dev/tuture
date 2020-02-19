import React from 'react';
import { css } from 'emotion';

function FileElement(props) {
  const { attributes, children } = props;

  return (
    <div
      {...attributes}
      className={css`
        display: block;
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

export default FileElement;
