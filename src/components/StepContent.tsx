import React from 'react';
import styled, { injectGlobal } from 'styled-components';

// @ts-ignore
import Markdown from 'react-markdown';

import StepDiff from './StepDiff';

import { Step, DiffItem } from '../types';

import tutureUtilities from '../utils';

interface StepContentProps {
  content: Step;
  diffItem: DiffItem;
}

/* tslint:disable-next-line */
const TutureContent = styled.div`
  max-width: 700px;
  padding-left: 49px;
  padding-right: 49px;
`;

/* tslint:disable-next-line */
const TutureContentHeader = styled.h1`
  font-family: STSongti-SC-Bold;
  font-size: 42px;
  color: rgba(0, 0, 0, 0.84);
  margin-top: 0;
  margin-bottom: 14px;
`;

injectGlobal`
  .markdown p {
    font-family: STSongti-SC-Regular;
    font-size: 21px;
    line-height: 1.58;
    margin: 16px 0;
    color: rgba(0,0,0,0.84);
  }


  .markdown pre {
    font-family: Monaco,Menlo,"Courier New",Courier,monospace;
    font-size: 16px;
    font-weight: 400;
    color: rgba(0,0,0,0.84);
    display: block;
    padding: 20px;
    background-color: rgba(0, 0, 0, .05);
    margin: 44px 0;
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

  .markdown :not(pre) > code {
    font-family: Monaco,Monaco,"Courier New",Courier,monospace;
    background-color: rgba(0, 0, 0, .05);
    padding: 3px 4px;
    margin: 0 2px;
    font-size: 16px;
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

export default class StepContent extends React.Component<StepContentProps> {
  renderExplain = (
    explain: string[] | string,
  ): React.ReactNode | React.ReactNodeArray => {
    if (tutureUtilities.isArray(explain)) {
      const arrExplain = explain as string[];
      return arrExplain.map((explainItem: string, i: number) => (
        <Markdown key={i} source={explainItem} className="markdown" />
      ));
    }

    return <Markdown source={explain as string} className="markdown" />;
  };

  render() {
    const { content, diffItem } = this.props;
    const { name, explain, diff, commit } = content;

    return (
      <TutureContent>
        <TutureContentHeader>{name}</TutureContentHeader>
        {this.renderExplain(explain)}
        <StepDiff
          diff={diff}
          diffItem={diffItem}
          commit={commit}
          renderExplain={this.renderExplain}
        />
      </TutureContent>
    );
  }
}
