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
        & > * + * {
          margin-left: 15px;
        }
      `,
    )}
  />
);

export default Menu;
