import React from 'react';
import { cx, css } from 'emotion';

const Button = React.forwardRef(
  (
    {
      className,
      active,
      title,
      reversed,
      handleMouseDown,
      handleClick,
      ...props
    },
    ref,
  ) => (
    /* eslint-disable no-nested-ternary */
    <span
      {...props}
      ref={ref}
      title={title}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed
          ? active
            ? 'white'
            : '#aaa'
          : active
            ? 'black'
            : '#ccc'};
        `,
      )}
    />
    /* eslint-enable no-nested-ternary */
  ),
);

export default Button;
