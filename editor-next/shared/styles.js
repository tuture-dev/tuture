import { css, Global } from '@emotion/core';

export const globalStyles = (
  <Global
    styles={css`
      .ant-drawer-left.ant-drawer-open .ant-drawer-content-wrapper {
        box-shadow: none;
      }

      .ant-input {
        border: none !important;
      }

      .ant-input:hover,
      .ant-input:active,
      .ant-input:focus {
        border: none;
        box-shadow: none;
      }
    `}
  />
);
