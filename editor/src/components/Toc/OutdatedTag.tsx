import React from 'react';
import { Tooltip, Tag } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

function OutdatedTip() {
  return (
    <Tooltip title="点击查看什么是过时步骤">
      <Tag
        css={css`
          color: #fa8c16;
          background: #fff7e6;
          border-color: #ffd591;

          &:hover {
            cursor: pointer;
          }
        `}
      >
        <a
          href="https://docs.tuture.co/reference/tuture-yml-spec.html#outdated"
          target="_blank"
          rel="noopener noreferrer"
          css={css`
            color: #fa8c16 !important;
          `}
        >
          过时
        </a>
      </Tag>
    </Tooltip>
  );
}

export default OutdatedTip;
