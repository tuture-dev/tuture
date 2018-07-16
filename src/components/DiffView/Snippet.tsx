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
    text-align: left;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
    font-family: Monaco,Menlo,"Courier New",Courier,monospace;
    font-size: 16px;
    color: rgba(0,0,0,0.66);
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
