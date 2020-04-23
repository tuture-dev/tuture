import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import IconFont from 'components/IconFont';

function DeleteButton(props: { onClick?: React.MouseEventHandler }) {
  return (
    <IconFont
      type="icon-delete1"
      onClick={props.onClick}
      css={css`
        color: #8c8c8c;

        &:hover {
          color: #595959;
          cursor: pointer;
        }

        & > svg {
          width: 12px;
          height: 12px;
        }
      `}
    />
  );
}

export default DeleteButton;
