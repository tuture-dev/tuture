import React from 'react';
import styled, { injectGlobal } from 'styled-components';

import ExplainedItem from './ExplainedItem';
import StepDiff from './StepDiff';

import { Step, DiffItem } from '../types';

import tutureUtilities from '../utils';

interface StepContentProps {
  content: Step;
  diffItem: DiffItem;
}

/* tslint:disable-next-line */
const TutureWrapper = styled.div`
  max-width: 680px;
`;

/* tslint:disable-next-line */
const TutureContentHeader = styled.h1`
  font-family: STSongti-SC-Bold;
  font-size: 42px;
  color: rgba(0, 0, 0, 0.84);
  margin-top: 0;
  margin-bottom: 14px;
`;

export default class StepContent extends React.Component<StepContentProps> {
  render() {
    const { content, diffItem } = this.props;
    const { name, explain, diff, commit } = content;

    return (
      <TutureWrapper>
        <TutureContentHeader>{name}</TutureContentHeader>
        <ExplainedItem explain={explain}>
          <StepDiff diff={diff} diffItem={diffItem} commit={commit} />
        </ExplainedItem>
      </TutureWrapper>
    );
  }
}
