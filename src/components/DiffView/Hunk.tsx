import React, { Component } from 'react';
import { injectGlobal } from 'styled-components';

import UnifiedHunk from './UnifiedHunk';
import SplitHunk from './SplitHunk';

import { Hunk as HunkType } from '../../types';

interface HunkProps {
  viewType: string;
  hunk: HunkType;
}

injectGlobal`
  .diff {
    table-layout: fixed;
    border-collapse: collapse;
    width: 100%;
  }

  .diff-gutter-col {
    width: 4.2em;
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
    background-color: #cb2a1d;
  }

  .diff td {
    vertical-align: top;
  }
  .diff-line {
    line-height: 1.5;
    font-family: Consolas, Courier, monospace;
  }

  .diff-gutter > a {
    color: inherit;
    display: block;
  }

  .diff-gutter:empty,
  .diff-gutter > a {
    padding: 0 1ch;
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
  }

  .diff-gutter-delete {
  }

  .diff-gutter-omit {
    cursor: default;
  }

  .diff-gutter-selected {
    background-color: #fef6b9;
  }

  .diff-code {
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
    padding: 0;
    padding-left: .5em;
    max-width: 557px;
  }

  .diff-code-insert {
    color: #eaffee;
  }

  .diff-code-delete {
    color: #fdeff0;
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
    padding: 20px;
    color: rgba(0,0,0,0.84);
    display: block;
    padding: 20px;
    background-color: rgba(0, 0, 0, .05);
  }

  .diff-file-header {
  }

  .filename {
    margin-right: 1em;
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
    const { viewType, hunk } = this.props;

    /* tslint:disable-next-line */
    const RenderingHunk = viewType === 'Unified' ? UnifiedHunk : SplitHunk;

    return <RenderingHunk hunk={hunk} />;
  }
}
