import React from 'react';
import styled from 'styled-components';

import { AppProps } from './App';
import StepContent from './StepContent';
import { Tuture, Step } from '../types/';

interface ContentProps extends AppProps {}

/* tslint:disable-next-line */
const ContentWrapper = styled.div`
  margin-top: -44px;
`;

export default class Content extends React.Component<ContentProps> {
  public render() {
    const { tuture, diff } = this.props;
    const renderContent: any = [];

    (tuture as Tuture).steps.map((step, index: number) => {
      const diffItem = diff[index];
      renderContent.push(
        <StepContent key="content" content={step} diffItem={diffItem} />,
      );
    });
    return <ContentWrapper>{renderContent}</ContentWrapper>;
  }
}
