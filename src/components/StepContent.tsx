import React from 'react';
import styled from 'styled-components';

import { DiffItem } from './DiffView';
import ExplainedItem from './ExplainedItem';
import StepDiff from './StepDiff';

import { Step } from '../types';
import { handleAnchor } from '../utils/common';

interface StepContentProps {
  content: Step;
  diffItem: DiffItem | string;
  isEditMode: boolean;
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
/* tslint:disable-next-line */
const TutureWrapper = styled.div`
  max-width: 788px;
  margin-left: 282px;
  &:hover {
    box-shadow: ${(props: { isEditMode: boolean }) =>
      props.isEditMode
        ? '0 1px 4px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(0, 0, 0, 0.09)'
        : 'none'};
    transition: box-shadow 100ms;
  }
`;

/* tslint:disable-next-line */
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
      isEditMode,
      updateTutureExplain,
      updateTutureDiffOrder,
    } = this.props;
    const { name, explain, diff, commit } = content;

    return (
      <TutureWrapper id={handleAnchor(name)} isEditMode={isEditMode}>
        <TutureContentHeader>{name}</TutureContentHeader>
        <ExplainedItem
          explain={explain}
          isRoot={true}
          isEditMode={isEditMode}
          commit={commit}
          diffKey="root"
          updateTutureExplain={updateTutureExplain}>
          <StepDiff
            diff={diff}
            diffItem={diffItem}
            commit={commit}
            isEditMode={isEditMode}
            updateTutureExplain={updateTutureExplain}
            updateTutureDiffOrder={updateTutureDiffOrder}
          />
        </ExplainedItem>
      </TutureWrapper>
    );
  }
}
