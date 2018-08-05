import React from 'react';
import styled from 'styled-components';

import ExplainedItem from './ExplainedItem';
import StepDiff from './StepDiff';

import { Step, DiffItem } from '../types';
import { handleAnchor } from '../utils/common';

interface StepContentProps {
  content: Step;
  diffItem: DiffItem | string;
  isEditMode: boolean;
  updateTuture: () => void;
}
/* tslint:disable-next-line */
const TutureWrapper = styled.div`
  max-width: 788px;
  margin-left: 282px;
  padding: 10px;
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
  font-family: STSongti-SC-Bold;
  font-size: 45px;
  color: rgba(0, 0, 0, 0.84);
  margin-top: 44px;
  margin-bottom: 14px;
  padding-left: 20px;
  padding-right: 20px;
`;

export default class StepContent extends React.Component<StepContentProps> {
  render() {
    const { content, diffItem, isEditMode, updateTuture } = this.props;
    const { name, explain, diff, commit } = content;
    const anchorClassName = handleAnchor(name);

    return (
      <TutureWrapper id={anchorClassName} isEditMode={isEditMode}>
        <TutureContentHeader>{name}</TutureContentHeader>
        <ExplainedItem
          explain={explain}
          isRoot={true}
          isEditMode={isEditMode}
          updateTuture={updateTuture}>
          <StepDiff
            diff={diff}
            diffItem={diffItem}
            commit={commit}
            isEditMode={isEditMode}
            updateTuture={updateTuture}
          />
        </ExplainedItem>
      </TutureWrapper>
    );
  }
}
