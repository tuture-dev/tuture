import { css, Global } from '@emotion/core';

export const globalStyles = (
  <Global
    styles={css`
      html,
      input,
      textarea {
        font-family: 'Roboto', 'Ubuntu Mono', Consolas, monospace;
        line-height: 1.4;
        background: #eee;
      }

      body {
        margin: 0;
        line-height: 24px;
      }

      h1 {
        font-size: 28px;
        line-height: 36px;
        padding: 7px 0;
      }

      h2 {
        font-size: 24px;
        line-height: 32px;
        padding: 7px 0;
      }

      h3 {
        font-size: 20px;
        line-height: 28px;
        padding: 7px 0;
      }

      h4 {
        font-size: 16px;
        line-height: 24px;
        padding: 7px 0;
      }

      p {
        line-height: 24px;
        margin: 0;
      }

      img {
        margin: 1em 0;
      }

      pre {
        background-color: #eee;
        white-space: pre-wrap;
        margin: 0;
      }

      :not(pre) > code {
        font-family: monospace;
        background-color: #eee;
        padding: 3px;
      }

      img {
        max-width: 100%;
        max-height: 20em;
      }

      blockquote {
        border-left: 2px solid #ddd;
        margin: 0.5em 0;
        padding-left: 10px;
        color: #aaa;
      }

      blockquote[dir='rtl'] {
        border-left: none;
        margin: 0.5em 0;
        padding-left: 0;
        padding-right: 10px;
        border-right: 2px solid #ddd;
      }

      table {
        border-collapse: collapse;
      }

      td {
        padding: 10px;
        border: 2px solid #ddd;
      }

      input {
        box-sizing: border-box;
        font-size: 0.85em;
        width: 100%;
        padding: 0.5em;
        border: 2px solid #ddd;
        background: #fafafa;
      }

      input:focus {
        outline: 0;
        border-color: blue;
      }

      a {
        cursor: pointer;
        word-wrap: break-word;
        text-decoration: none;
        color: #096dd9;
      }

      [data-slate-editor] > * + * {
        margin-top: 1em;
      }

      .anticon > svg {
        height: 16px;
        width: 16px;
      }

      .ant-select-selection {
        background: none;
        border: none;
        padding: 2px;
      }

      .ant-select-selection svg {
        color: black;
      }

      .ant-select-selection:active {
        border: none;
        box-shadow: none;
      }

      .ant-select-selection:focus {
        border: none;
        box-shadow: none;
      }

      .ant-select-selection-selected-value {
        font-size: 14px;
        font-weight: 400;
      }

      .ant-drawer-left.ant-drawer-open .ant-drawer-content-wrapper {
        box-shadow: none;
      }

      .ant-input {
        border: none !important;
        padding: 0;
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
