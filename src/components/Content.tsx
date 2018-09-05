import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import { AppProps } from './App';
import StepContent from './StepContent';
import Brief from './Brief';

interface ContentProps extends AppProps {}

/* tslint:disable-next-line */
const ContentWrapper = styled.div`
  margin-top: -32px;
`;

@inject('store')
@observer
export default class Content extends React.Component<ContentProps> {
  public render() {
    const { store, diff } = this.props;
    const renderContent: any = [];

    store.tuture.steps.map((step, index: number) => {
      const diffItem = diff[index];

      renderContent.push(
        <StepContent
          key={index}
          content={step}
          index={index}
          diffItem={diffItem}
        />,
      );
    });

    return (
      <ContentWrapper>
        <Brief
          title={store.tuture.name}
          description={store.tuture.description}
          techTag={store.tuture.topics}
        />
        {renderContent}
      </ContentWrapper>
    );
  }
}
