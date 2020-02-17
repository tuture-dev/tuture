import React from 'react';
import { cx, css } from 'emotion';

const Button = ({
  className,
  title,
  handleMouseDown,
  handleClick,
  ...props
}) => (
  /* eslint-disable no-nested-ternary */
  <span
    {...props}
    title={title}
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
