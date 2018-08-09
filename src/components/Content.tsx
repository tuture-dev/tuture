import React from 'react';
import styled from 'styled-components';

import { AppProps } from './App';
import StepContent from './StepContent';
import { Tuture, Step } from '../types/';

interface ContentProps extends AppProps {
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
const ContentWrapper = styled.div`
  margin-top: -32px;
`;

export default class Content extends React.Component<ContentProps> {
  public render() {
    const {
      tuture,
      diff,
      isEditMode,
      updateTutureExplain,
      updateTutureDiffOrder,
    } = this.props;
    const renderContent: any = [];

    (tuture as Tuture).steps.map((step, index: number) => {
      const diffItem = diff[index];

      if (!step.outdated) {
        renderContent.push(
          <StepContent
            key={index}
            content={step}
            diffItem={diffItem}
            isEditMode={isEditMode}
            updateTutureExplain={updateTutureExplain}
            updateTutureDiffOrder={updateTutureDiffOrder}
          />,
        );
      }
    });
    return <ContentWrapper>{renderContent}</ContentWrapper>;
  }
}
