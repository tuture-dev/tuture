import React from 'react';
import { css } from 'emotion';

function FileElement(props) {
  const { attributes, children, element } = props;

  return (
    <div
      {...attributes}
      className={css`
        display: ${element.display ? 'block' : 'none'};
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
