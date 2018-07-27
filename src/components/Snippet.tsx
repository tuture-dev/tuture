import Prism from 'prismjs';
import React, { PureComponent } from 'react';
import { injectGlobal } from 'styled-components';

import { LanguageContext } from './App';

interface SnippetProps {
  code: string;
}

injectGlobal`
  code[class*="language-"],
  pre[class*="language-"] {
    text-align: left;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
    font-family: Monaco,Menlo,"Courier New",Courier,monospace;
    font-size: 14px;
    color: rgba(0,0,0,0.84);
  }

  /* Code blocks */
  pre[class*="language-"] {
    margin: 0;
    overflow: auto;
  }

  /* Inline code */
  :not(pre) > code[class*="language-"] {
    padding: .1em;
    border-radius: .3em;
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
  .namespace {
    opacity: .7;
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
    color: #DD4A68;
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
`;

export default class Snippet extends PureComponent<SnippetProps> {
  componentDidMount() {
    Prism.highlightAll();
  }

  render() {
    return (
      <LanguageContext.Consumer>
        {(lang) => {
          return (
            <pre>
              <code className={`language-${lang}`}>{this.props.code}</code>
            </pre>
          );
        }}
      </LanguageContext.Consumer>
    );
  }
}
