import React, { PureComponent } from 'react';
import { injectGlobal } from 'styled-components';

// @ts-ignore
import Highlight from 'react-highlight';

interface SnippetProps {
  code: string;
  lang: string;
}

injectGlobal`
  code,
  pre {
    line-height: 2;
    text-align: left;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
    font-family: Monaco,Menlo,"Courier New",Courier,monospace;
    font-size: 14px;
    color: rgba(0,0,0,0.84);
  }

  /* Code blocks */
  pre {
    margin: 0;
  }

  /* Inline code */
  :not(pre) > code {
    padding: .1em;
    border-radius: .3em;
    white-space: normal;
  }

  .hljs,
  .hljs-subst {
    color: #444;
  }

  .hljs-comment {
    color: #888888;
  }

  .hljs-keyword,
  .hljs-attribute,
  .hljs-selector-tag,
  .hljs-meta-keyword,
  .hljs-doctag,
  .hljs-name {
    font-weight: bold;
  }

  .hljs-type,
  .hljs-string,
  .hljs-number,
  .hljs-selector-id,
  .hljs-selector-class,
  .hljs-quote,
  .hljs-template-tag,
  .hljs-deletion {
    color: #880000;
  }

  .hljs-title,
  .hljs-section {
    color: #880000;
    font-weight: bold;
  }

  .hljs-regexp,
  .hljs-symbol,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-link,
  .hljs-selector-attr,
  .hljs-selector-pseudo {
    color: #BC6060;
  }

  .hljs-literal {
    color: #78A960;
  }

  .hljs-built_in,
  .hljs-bullet,
  .hljs-code,
  .hljs-addition {
    color: #397300;
  }

  .hljs-meta {
    color: #1f7199;
  }

  .hljs-meta-string {
    color: #4d99bf;
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: bold;
  }
`;

export default class Snippet extends PureComponent<SnippetProps> {
  render() {
    return <Highlight className={this.props.lang}>{this.props.code}</Highlight>;
  }
}
