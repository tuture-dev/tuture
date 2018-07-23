import React, { PureComponent } from 'react';
import { injectGlobal } from 'styled-components';

// @ts-ignore
import Markdown from 'react-markdown';

import tutureUtilities from '../utils';
import { Explain, ExplainObj } from '../types';

interface ExplainedItemProps {
  explain: Explain;
}

injectGlobal`
  .markdown p, li {
    font-family: STSongti-SC-Regular;
    font-size: 21px;
    line-height: 1.58;
    margin: 16px 0;
    color: rgba(0,0,0,0.66);
  }

  .markdown li {
    margin: 8px 0;
  }

  .markdown pre {
    font-family: Monaco,Menlo,"Courier New",Courier,monospace;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0,0,0,0.66);
    display: block;
    padding: 20px;
    background-color: rgba(0, 0, 0, .05);
    margin: 32px 0 !important;
  }

  .markdown a {
    color: rgba(0,0,0,0.84);
    text-decoration: none;
    background-image: linear-gradient(to bottom,rgba(0,0,0,.68) 50%,rgba(0,0,0,0) 50%);
    background-repeat: repeat-x;
    background-size: 2px .1em;
    background-position: 0 1.07em;
    &:hover {
      cursor: pointer;
    }
  }

  .markdown img {
    display: block;
    width: 700px;
    margin: 44px 0;
  }

  .markdown :not(pre) > code {
    font-family: Monaco,Monaco,"Courier New",Courier,monospace;
    background-color: rgba(0, 0, 0, .05);
    padding: 3px 4px;
    margin: 0 2px;
    font-size: 14px;
  }

  .markdown blockquote {
    font-style: italic;
    margin-top: 28px;
    border-left: 3px solid rgba(0,0,0,.84);
    padding-left: 20px;
    margin-left: -23px;
    padding-bottom: 2px;
  }

  .markdown blockquote p {
    margin: 0;
    line-height: 1.58;
  }

  .markdown blockquote :not(pre) > code {
    font-style: normal;
  }
`;

export default class ExplainedItem extends PureComponent<ExplainedItemProps> {
  renderExplainStr = (explain: string): React.ReactNode => {
    return <Markdown source={explain} className="markdown" />;
  };

  renderExplainArr = (explain: string[]): React.ReactNodeArray => {
    return explain.map((explainItem: string, i: number) => (
      <Markdown key={i} source={explainItem} className="markdown" />
    ));
  };

  renderPreExplain = (
    explain: Explain,
  ): React.ReactNode | React.ReactNodeArray => {
    if (tutureUtilities.isArray(explain)) {
      return this.renderExplainArr(explain as string[]);
    }

    if (typeof explain === 'object') {
      return this.renderPreExplain((explain as ExplainObj).pre);
    }

    return this.renderExplainStr(explain as string);
  };

  renderPostExplain = (
    explain: Explain,
  ): React.ReactNode | React.ReactNodeArray => {
    const explainObj = explain as ExplainObj;
    if (explainObj) {
      const post = explainObj.post;
      if (tutureUtilities.isArray(post)) {
        return this.renderExplainArr(post as string[]);
      }
      return this.renderExplainStr(post as string);
    }
    return null;
  };

  render() {
    return (
      <div>
        {this.renderPreExplain(this.props.explain)}
        {this.props.children}
        {this.renderPostExplain(this.props.explain)}
      </div>
    );
  }
}
