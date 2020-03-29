import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

type ButtonProps = {
  className: string;
  handleMouseDown: React.MouseEventHandler;
  handleClick: React.MouseEventHandler;
  [prop: string]: any;
};

const Button = React.forwardRef<HTMLSpanElement, ButtonProps>(
  ({ className, handleMouseDown, handleClick, ...props }, ref) => (
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
  ),
);

export default Button;
