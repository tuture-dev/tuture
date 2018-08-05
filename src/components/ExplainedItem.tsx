import React, { PureComponent } from 'react';
import styled, { injectGlobal } from 'styled-components';
import classnames from 'classnames';

// @ts-ignore
import Markdown from 'react-markdown';

import { Explain } from '../types';
import { isClientOrServer } from '../utils/common';

interface ExplainedItemProps {
  explain: Explain;
  isRoot: boolean;
  isEditMode: boolean;
}

interface ExplainedItemState extends Explain {
  nowTab: 'edit' | 'preview';
  preHeight: string;
  postHeight: string;
  [key: string]: string;
}

injectGlobal`
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

  .is-root {
    padding: 0 24px 12px;
  }

  .editor > .is-root {
    padding-left: 0;
    padding-right: 0;
  }

  textarea {
    display: block;
    width: 100%;
    height: auto;
    overflow-y: hidden;
    vertical-align: top;
    box-sizing: border-box;
    font-family: 'Monaco', courier, monospace;
    padding: 20px;
    resize: none;
    font-size: 14px;
    border: 1px solid #d1d5da;
    box-shadow: inset 0 1px 2px rgba(27,31,35,0.075);
  }
`;

/* tslint:disable-next-line */
const Button = styled.button`
  border: ${(props: { selected: boolean }) =>
    props.selected ? '1px solid #03a87c;' : '1px solid rgba(0, 0, 0, 0.15)'};
  border-radius: 4px;
  height: 37px;
  line-height: 37px;
  padding: 0 18px;
  font-size: 17px;
  color: ${(props: { selected: boolean }) =>
    props.selected ? '#03a87c' : 'rgba(0,0,0,.54)'};
  background: rgba(0, 0, 0, 0);
  margin-right: 8px;
`;

/* tslint:disable-next-line */
const TabWrapper = styled.div`
  margin-bottom: 10px;
`;

export default class ExplainedItem extends PureComponent<
  ExplainedItemProps,
  ExplainedItemState
> {
  constructor(props: ExplainedItemProps) {
    super(props);

    if (isClientOrServer() === 'client') {
      const textareaArr = document.getElementsByTagName('textarea');
      Array.from(textareaArr).map((textarea) => {
        console.log(textarea.scrollHeight);
        textarea.style.height = textarea.scrollHeight + 'px';
      });
    }

    const { explain } = this.props;
    this.state = {
      ...explain,
      nowTab: 'edit',
      preHeight: 'auto',
      postHeight: 'auto',
    };
  }

  renderExplainStr = (type: 'pre' | 'post'): React.ReactNode => {
    const { isRoot } = this.props;
    return (
      <Markdown
        source={this.state[type]}
        className={classnames('markdown', { 'is-root': isRoot })}
      />
    );
  };

  handleChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const { name, value, scrollHeight } = e.currentTarget;
    const explainState = { [name]: value } as Explain;
    this.setState({ ...explainState, [`${name}Height`]: scrollHeight });
  };

  handleTabClick = (nowTab: 'edit' | 'preview') => {
    this.setState({ nowTab });
  };

  renderEditExplainStr = (type: 'pre' | 'post'): React.ReactNode => {
    const { isRoot } = this.props;
    const { nowTab } = this.state;
    return (
      <div className={classnames('editor', { 'is-root': isRoot })}>
        <TabWrapper>
          <Button
            name="edit"
            onClick={() => this.handleTabClick('edit')}
            selected={nowTab === 'edit'}>
            编写
          </Button>
          <Button
            name="preview"
            onClick={() => this.handleTabClick('preview')}
            selected={nowTab === 'preview'}>
            预览
          </Button>
        </TabWrapper>
        {nowTab === 'edit' ? (
          <textarea
            name={type}
            value={this.state[type]}
            placeholder="写一点解释..."
            onChange={this.handleChange}
            style={{ height: this.state[`${type}Height`] }}
          />
        ) : (
          <Markdown
            source={this.state[type]}
            className={classnames('markdown', { 'is-root': isRoot })}
          />
        )}
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
