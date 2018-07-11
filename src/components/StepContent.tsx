import React from 'react';
import styled from 'styled-components';

// @ts-ignore
import Markdown from 'react-markdown';

import StepDiff from './StepDiff';

import { Step, DiffItem } from '../types';

import tutureUtilities from '../utils';

interface StepContentProps {
  viewType: 'Unified' | 'Split';
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
const TutureContentHeader = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
`;

export default class StepContent extends React.Component<StepContentProps> {
  renderExplain = (
    explain: string[] | string,
  ): React.ReactNode | React.ReactNodeArray => {
    if (tutureUtilities.isArray(explain)) {
      const arrExplain = explain as string[];
      return arrExplain.map((explainItem: string, i: number) => (
        <Markdown key={i} source={explainItem} />
      ));
    }

    return <Markdown source={explain as string} />;
  };

  render() {
    const { content, diffItem } = this.props;
    const { name, explain, diff, commit } = content;
    const { viewType } = this.props;

    return (
      <TutureContent>
        <TutureContentHeader>
          <h1>{name}</h1>
        </TutureContentHeader>
        {this.renderExplain(explain)}
        <StepDiff
          diff={diff}
          diffItem={diffItem}
          commit={commit}
          viewType={viewType}
          renderExplain={this.renderExplain}
        />
      </TutureContent>
    );
  }
}
