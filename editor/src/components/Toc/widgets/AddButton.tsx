import React from 'react';

/** @jsx jsx */
import { css, jsx, SerializedStyles } from '@emotion/core';

import IconFont from 'components/IconFont';

function AddButton(props: {
  css?: SerializedStyles;
  onClick?: React.MouseEventHandler;
}) {
  return (
    <span className="list-item-action" onClick={props.onClick} css={props.css}>
      <span
        css={css`
          margin-right: 8px;
        `}
      >
        添加
      </span>
      <IconFont
        type="icon-doubleright"
        css={css`
          & > svg {
            width: 8px;
            height: 8px;
          }
        `}
      />
    </span>
  );
}

export default AddButton;
