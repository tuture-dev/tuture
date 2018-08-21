import React from 'react';
import styled from 'styled-components';

import { DiffItem } from './DiffView';
import ExplainedItem from './ExplainedItem';
import StepDiff from './StepDiff';

import { Step } from '../types';
import { handleAnchor, rem } from '../utils/common';

interface StepContentProps {
  content: Step;
  diffItem: DiffItem | string;
  updateTutureExplain: (
    commit: string,
    diffKey: string,
    name: 'pre' | 'post',
    value: string,
  ) => void;
  updateTutureDiffOrder: (
    commit: string,
    sourceIndex: number,
    destinationIndex: number,
  ) => void;
}

const TutureWrapper = styled.div`
  min-width: 400px;
  width: ${rem(759)}rem;
  margin-left: 282px;
`;

const TutureContentHeader = styled.h1`
  font-family: LucidaGrande-Bold;
  font-size: 37px;
  color: rgba(0, 0, 0, 0.84);
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 44px;
  margin-bottom: 0;
`;

export default class StepContent extends React.Component<StepContentProps> {
  render() {
    const {
      content,
      diffItem,
      updateTutureExplain,
      updateTutureDiffOrder,
    } = this.props;
    const { name, explain, diff, commit } = content;

    return (
      <TutureWrapper id={handleAnchor(name)}>
        <TutureContentHeader>{name}</TutureContentHeader>
        <ExplainedItem
          explain={explain}
          isRoot={true}
          commit={commit}
          diffKey="root"
          updateTutureExplain={updateTutureExplain}>
          <StepDiff
            diff={diff}
            diffItem={diffItem}
            commit={commit}
            updateTutureExplain={updateTutureExplain}
            updateTutureDiffOrder={updateTutureDiffOrder}
          />
        </ExplainedItem>
      </TutureWrapper>
    );
  }
}
