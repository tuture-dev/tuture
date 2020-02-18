import React from 'react';
import { cx, css } from 'emotion';

const Button = ({ className, handleMouseDown, handleClick, ...props }) => (
  /* eslint-disable no-nested-ternary */
  <span
    {...props}
    onMouseDown={handleMouseDown}
    onClick={handleClick}
    className={cx(
      className,
      css`
        cursor: pointer;
      `,
    )}
  />
  /* eslint-enable no-nested-ternary */
);

export default Button;
