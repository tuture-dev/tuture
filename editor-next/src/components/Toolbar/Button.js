import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const Button = React.forwardRef(
  ({ className, handleMouseDown, handleClick, ...props }, ref) => (
    /* eslint-disable no-nested-ternary */
    <span
      {...props}
      ref={ref}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      className={className}
      css={css`
        cursor: pointer;
      `}
    />
    /* eslint-enable no-nested-ternary */
  ),
);

export default Button;
