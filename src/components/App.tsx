/* tslint:disable-next-line */
import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import { Helmet } from 'react-helmet';

import SideBarLeft from './SideBarLeft';
import StepContent from './StepContent';

import tutureUtilities from '../utils';
import { Tuture, DiffItem } from '../types/';
import { extractCommits, extractMetaData } from '../utils/extractors';

interface AppState {
  selectKey: number;
  tuture: Tuture;
  diff: DiffItem[];
}

export interface AppProps {
  // Page's title
  name?: string;
  tuture?: Tuture;
  diff?: string | DiffItem[];
}

/* tslint:disable-next-line */
const AppWrapper = styled.div`
  max-width: 970px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
`;

injectGlobal`
  html {
    font-size: 100%;
  }

  body {
    height: 100%;
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }

  #root {
    height: 100%;
    margin-top: 70px;
    margin-bottom: 70px;
  }

  h1 {
    font-size: 45px;
  }
`;

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      selectKey: 0,
      tuture: null,
      diff: null,
    };
  }

  updateSelect = (key: number): void => {
    this.setState({
      selectKey: key,
    });
  };

  render() {
    let tutorialTitle: string;
    let bodyContent: React.ReactNode;

    const { tuture, diff, name } = this.props;

    if (
      !tuture ||
      tutureUtilities.isObjectEmpty(tuture) ||
      !diff ||
      !tutureUtilities.isArray(diff)
    ) {
      bodyContent = <div>SSR is done!</div>;
    } else {
      const commits = extractCommits(tuture);
      tutorialTitle = extractMetaData(tuture).name;

      const { selectKey } = this.state;
      const nowRenderContent = tuture.steps[selectKey];
      const diffItem = diff[selectKey];
      bodyContent = [
        <SideBarLeft
          commits={commits}
          selectKey={selectKey}
          updateSelect={this.updateSelect}
        />,
        <StepContent
          key="content"
          content={nowRenderContent}
          diffItem={diffItem}
        />,
      ];
    }

    return (
      <AppWrapper>
        <Helmet>
          <title>{tutorialTitle}</title>
        </Helmet>
        <div>{name}</div>
        {bodyContent}
      </AppWrapper>
    );
  }
}

/* tslint:disable-next-line */
export const LanguageContext = React.createContext('textile');
