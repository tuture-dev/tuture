import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const Menu = ({ className, ...props }) => (
  <div
    {...props}
    className={className}
    css={css`
      & > * {
        display: inline-block;
      }
    `}
  />
);

export default Menu;
