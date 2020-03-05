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
        word-break: break-all;
      }

      input {
        box-sizing: border-box;
        font-size: 0.85em;
        width: 100%;
        border: 2px solid #ddd;
        background: #fafafa;
      }

      input:focus {
        outline: 0;
        border-color: blue;
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

      code[class*='language-'],
      pre[class*='language-'] {
        color: black;
        background: none;
        text-shadow: 0 1px white;
        font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
        font-size: 1em;
        text-align: left;
        white-space: pre;
        word-spacing: normal;
        word-break: normal;
        word-wrap: normal;
        line-height: 1.5;

        -moz-tab-size: 4;
        -o-tab-size: 4;
        tab-size: 4;

        -webkit-hyphens: none;
        -moz-hyphens: none;
        -ms-hyphens: none;
        hyphens: none;
      }

      pre[class*='language-']::-moz-selection,
      pre[class*='language-'] ::-moz-selection,
      code[class*='language-']::-moz-selection,
      code[class*='language-'] ::-moz-selection {
        text-shadow: none;
        background: #b3d4fc;
      }

      pre[class*='language-']::selection,
      pre[class*='language-'] ::selection,
      code[class*='language-']::selection,
      code[class*='language-'] ::selection {
        text-shadow: none;
        background: #b3d4fc;
      }

      @media print {
        code[class*='language-'],
        pre[class*='language-'] {
          text-shadow: none;
        }
      }

      /* Code blocks */
      pre[class*='language-'] {
        padding: 1em;
        margin: 0.5em 0;
        overflow: auto;
      }

      :not(pre) > code[class*='language-'],
      pre[class*='language-'] {
        background: #f5f2f0;
      }

      /* Inline code */
      :not(pre) > code[class*='language-'] {
        padding: 0.1em;
        border-radius: 0.3em;
        white-space: normal;
      }

      .token.comment,
      .token.prolog,
      .token.doctype,
      .token.cdata {
        color: slategray;
      }

      .token.punctuation {
        color: #999;
      }

      .token.namespace {
        opacity: 0.7;
      }

      .token.property,
      .token.tag,
      .token.boolean,
      .token.number,
      .token.constant,
      .token.symbol,
      .token.deleted {
        color: #905;
      }

      .token.selector,
      .token.attr-name,
      .token.string,
      .token.char,
      .token.builtin,
      .token.inserted {
        color: #690;
      }

      .token.operator,
      .token.entity,
      .token.url,
      .language-css .token.string,
      .style .token.string {
        color: #9a6e3a;
      }

      .token.atrule,
      .token.attr-value,
      .token.keyword {
        color: #07a;
      }

      .token.function,
      .token.class-name {
        color: #dd4a68;
      }

      .token.regex,
      .token.important,
      .token.variable {
        color: #e90;
      }

      .token.important,
      .token.bold {
        font-weight: bold;
      }
      .token.italic {
        font-style: italic;
      }

      .token.entity {
        cursor: help;
      }
    `}
  />
);
