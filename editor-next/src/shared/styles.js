import React from 'react';
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
      }

      h2 {
        font-size: 24px;
        line-height: 32px;
      }

      h3 {
        font-size: 20px;
        line-height: 28px;
      }

      h4 {
        font-size: 16px;
        line-height: 24px;
      }

      p {
        line-height: 24px;
        margin: 0;
      }

      img {
        margin: 1em 0;
      }

      pre {
        color: white;
        background-color: rgb(30, 30, 30);
        white-space: pre-wrap;
        margin: 0 !important;
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

      [data-slate-node='element']:not(li) {
        margin-top: 1em;
      }

      .anticon > svg {
        height: 16px;
        width: 16px;
      }

      .ant-select-selection-selected-value {
        font-size: 14px;
        font-weight: 400;
      }

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
