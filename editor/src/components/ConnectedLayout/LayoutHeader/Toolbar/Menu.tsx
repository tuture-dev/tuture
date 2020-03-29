import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

type MenuProps = {
  className?: string;
  [prop: string]: any;
};

const Menu = ({ className, ...props }: MenuProps) => (
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
