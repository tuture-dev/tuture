import { useFocused, useSelected } from 'tuture-slate-react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

function ImageElement(props) {
  const { attributes, children, element } = props;
  const { url } = element;
  const selected = useSelected();
  const focused = useFocused();
  const path = url.startsWith('http') || url.startsWith('/') ? url : `/${url}`;

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <img
          src={path}
          alt={path}
          css={css`
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
