import React from 'react';
import { css } from 'emotion';
import { useFocused, useSelected } from 'slate-react';

function ImageElement(props) {
  const { attributes, children, element } = props;
  const selected = useSelected();
  const focused = useFocused();

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <img
          src={element.url}
          alt={element.url}
          className={css`
            display: block;
            margin-left: auto;
            margin-right: auto;
            max-width: 100%;
            max-height: 20em;
            box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
          `}
        />
      </div>
      {children}
    </div>
  );
}

export default ImageElement;
