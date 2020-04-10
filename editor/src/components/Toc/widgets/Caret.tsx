import React from 'react';
import { Icon } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

function Caret(props: { type: 'caret-down' | 'caret-right' }) {
  return (
    <span
      css={css`
        position: absolute;
        margin-left: -20px;
        margin-top: -2px;
      `}
    >
      <Icon
        type={props.type}
        css={css`
          & > svg {
            width: 10px;
            height: 10px;
          }
        `}
      />
    </span>
  );
}

export default Caret;
