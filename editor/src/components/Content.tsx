import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { translate } from 'react-i18next';

import { AppProps } from './App';
import StepContent from './StepContent';
import Brief from './Brief';
import NoCommit from './NoCommit.png';

interface ContentProps extends AppProps {
  t?: any;
}

/* tslint:disable-next-line */
const ContentWrapper = styled.div`
  margin-top: -32px;
`;

const NoCommitContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200px;
`;

const NoCommitLogo = styled.img`
  height: 300px;
`;

const NoCommitText = styled.p`
  margin-top: 40px;
  font-size: 20px;
`;

@inject('store')
@observer
class Content extends React.Component<ContentProps> {
  public render() {
    const { store, diff, t } = this.props;
    const renderContent: any = [];
    let renderNoCommit = null;

    if (diff.length > 0) {
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
    } else {
      renderNoCommit = (
        <NoCommitContainer>
          <NoCommitLogo src={NoCommit} alt="" />
          <NoCommitText>{t('noCommitText')}</NoCommitText>
        </NoCommitContainer>
      );
    }

    return (
      <ContentWrapper>
        <Brief
          title={store.tuture.name}
          description={store.tuture.description}
          techTag={store.tuture.topics || []}
        />
        {renderContent}
        {renderNoCommit}
      </ContentWrapper>
    );
  }
}

export default translate('translations')(Content);
