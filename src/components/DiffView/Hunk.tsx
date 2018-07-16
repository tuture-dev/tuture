import React, { Component } from 'react';
import { injectGlobal } from 'styled-components';

import UnifiedHunk from './UnifiedHunk';

import { Hunk as HunkType } from '../../types';

interface HunkProps {
  hunk: HunkType;
}

injectGlobal`
  .diff {
    table-layout: fixed;
    border-collapse: collapse;
    width: 100%;
  }

  .diff-gutter-col {
    width: 50px;
  }

  .diff-gutter-omit {
    height: 0;
  }

  .diff-gutter-omit:before {
    content: " ";
    display: block;
    white-space: pre;
    width: 2px;
    height: 100%;
    margin-left: 2.2em;
    overflow: hidden;
  }

  .diff td {
    vertical-align: top;
  }
  .diff-line {
    line-height: 31px;
    font-family: Consolas, Courier, monospace;
  }

  .diff-gutter {
    max-width: 50px;
    padding: 0 16px;
  }

  .diff-gutter > a {
    color: inherit;
    display: block;
  }

  .diff-gutter:empty,
  .diff-gutter > a {
    text-align: right;
    cursor: pointer;
    -webkit-user-select: none;
      -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
  }

  .diff-gutter:empty:before,
  .diff-gutter > a:before {
    content: attr(data-line-number);
  }

  .diff-gutter-insert {
    color: rgba(79,201,79,0.84);
  }

  .diff-gutter-delete {
    color: rgba(239,91,108,0.84);
  }

  .diff-gutter-omit {
    cursor: default;
  }

  .diff-gutter-selected {
    background-color: #fef6b9;
  }

  .diff-code {
    padding: 0;
    max-width: 557px;
  }

  .diff-code-insert code {
    color: rgba(79,201,79,0.84);
  }

  .diff-code-delete code {
    color: rgba(239,91,108,0.84);
  }

  .diff-code-selected {
    color: #fffce0;
  }

  .diff-omit {
    color: #fafbfc;
  }

  .diff-hunk-header {
    line-height: 1.5;
  }

  .diff-hunk-header-content {
    font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace;
    padding: 0;
  }

  .diff-hunk-header {
    display: none;
  }

  .diff-file {
    color: rgba(0,0,0,0.84);
    display: block;
    padding: 8px 20px 20px 20px;
    background-color: rgba(0, 0, 0, .05);
    margin: 32px 0;
  }

  .diff-file-header {
    font-family: Monaco;
    font-size: 16px;
    color: rgba(0,0,0,0.24);
    text-align: right;
  }

  .addition-count {
    margin-right: 1em;
    color: #88b149;
  }

  .deletion-count {
    margin-right: 1em;
    color: #ee5b60;
  }

`;

export default class Hunk extends Component<HunkProps> {
  render() {
    const { hunk } = this.props;

    return <UnifiedHunk hunk={hunk} />;
  }
}
