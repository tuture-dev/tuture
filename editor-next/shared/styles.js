import { css, Global } from '@emotion/core';

export const globalStyles = (
  <Global
    styles={css`
      .ant-drawer-left.ant-drawer-open .ant-drawer-content-wrapper {
        box-shadow: none;
      }

      .ant-drawer-body {
        padding: 24px 0;
      }

      .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
        background: transparent;
      }
    `}
  />
);
