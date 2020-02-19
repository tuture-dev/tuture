import React from 'react';
import { cx, css } from 'emotion';

const Button = React.forwardRef(
  ({ className, handleMouseDown, handleClick, ...props }, ref) => (
    /* eslint-disable no-nested-ternary */
    <span
      {...props}
      ref={ref}
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
  ),
);

export default Button;
