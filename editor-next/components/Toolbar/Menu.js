import React from 'react';
import { cx, css } from 'emotion';

const Menu = ({ className, ...props }) => (
  <div
    {...props}
    className={cx(
      className,
      css`
        & > * {
          display: inline-block;
        }
      `,
    )}
  />
);

export default Menu;
