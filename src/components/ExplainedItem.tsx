import React, { PureComponent } from 'react';
import { injectGlobal } from 'styled-components';
import classnames from 'classnames';

// @ts-ignore
import Markdown from 'react-markdown';

import tutureUtilities from '../utils';
import { Explain } from '../types';

interface ExplainedItemProps {
  explain: Explain;
  isRoot: boolean;
  isEditMode: boolean;
}

interface ExplainedItemState extends Explain {}

injectGlobal`
  .is-root {
    padding-left: 24px;
    padding-right: 24px;
  }

  .markdown p, li {
    font-family: STSongti-SC-Regular;
    font-size: 18px;
    line-height: 1.58;
    margin: 16px 0;
    color: rgba(0,0,0,0.84);
  }

  .markdown li {
    margin: 8px 0;
  }

  .markdown h1 {
    font-size: 45px;
  }

  .markdown h2 {
    font-size: 37px;
  }

  .markdown h3 {
    font-size: 31px;
  }

  .markdown h4 {
    font-size: 26px;
  }

  .markdown h5 {
    font-size: 21px;
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

  #editor {
    margin: 0;
    height: 100%;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #333;
  }

  textarea, #editor > div {
    display: inline-block;
    width: 49%;
    height: 100%;
    vertical-align: top;
    box-sizing: border-box;
    padding: 0 20px;
  }

  textarea {
    border: none;
    border-right: 1px solid #ccc;
    resize: none;
    outline: none;
    background-color: #f6f6f6;
    font-size: 14px;
    font-family: 'Monaco', courier, monospace;
    padding: 20px;
  }

  code {
    color: #f66;
  }
`;

export default class ExplainedItem extends PureComponent<
  ExplainedItemProps,
  ExplainedItemState
> {
  constructor(props: ExplainedItemProps) {
    super(props);

    const { explain } = this.props;
    this.state = { ...explain };
  }

  handleUpdate = (e: React.FormEvent<HTMLTextAreaElement>) => {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  renderExplainStr = (type: 'pre' | 'post'): React.ReactNode => {
    const { isRoot } = this.props;
    return (
      <Markdown
        source={this.state[type]}
        className={classnames('markdown', { 'is-root': isRoot })}
      />
    );
  };

  renderEditExplainStr = (type: 'pre' | 'post'): React.ReactNode => {
    const { isRoot } = this.props;
    return (
      <div id="editor">
        <textarea
          name={type}
          value={this.state[type]}
          onInput={this.handleUpdate}
        />
        <Markdown
          source={this.state[type]}
          className={classnames('markdown', { 'is-root': isRoot })}
        />
      </div>
    );
  };

  renderExplain = (
    type: 'pre' | 'post',
    isEditMode: boolean,
  ): React.ReactNode => {
    return isEditMode
      ? this.renderEditExplainStr(type)
      : this.renderExplainStr(type);
  };

  render() {
    const { isEditMode } = this.props;
    return (
      <div>
        {this.renderExplain('pre', isEditMode)}
        {this.props.children}
        {this.renderExplain('post', isEditMode)}
      </div>
    );
  }
}
