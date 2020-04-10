import React from 'react';

/** @jsx jsx */
import { css, jsx, SerializedStyles } from '@emotion/core';

import IconFont from 'components/IconFont';

import { listItemActionStyle } from '../styles';

function AddButton(props: {
  css?: SerializedStyles;
  onClick?: React.MouseEventHandler;
}) {
  return (
    <span
      className="list-item-action"
      onClick={props.onClick}
      css={css`
        ${listItemActionStyle}
        display: flex;
        flex-direction: row;
        align-items: center;
        visibility: hidden;
      `}
    >
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
