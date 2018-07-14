import Prism from 'prismjs';
import React, { PureComponent } from 'react';
import { injectGlobal } from 'styled-components';

import { LanguageContext } from '../App';

interface SnippetProps {
  code: string;
}

injectGlobal`
  code[class*="language-"],
  pre[class*="language-"] {
    background: none;
    text-align: left;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
    font-family: Monaco,Menlo,"Courier New",Courier,monospace;
    font-size: 16px;
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

  .namespace {
    opacity: .7;
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
