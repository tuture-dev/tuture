/* tslint:disable-next-line */
import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import { Helmet } from 'react-helmet';

import SideBarLeft from './SideBarLeft';
import Content from './Content';

import tutureUtilities from '../utils';
import { Tuture, DiffItem } from '../types/';
import { extractCommits, extractMetaData } from '../utils/extractors';
import Header from './Header';

interface AppState {
  isEditMode: boolean;
}

export interface AppProps {
  tuture?: Tuture | string;
  diff?: string | DiffItem[] | string;
}

/* tslint:disable-next-line */
const AppContent = styled.div`
  max-width: 1080px;
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
      isEditMode: false,
    };
  }

  toggleEditMode = () => {
    const { isEditMode } = this.state;
    this.setState({
      isEditMode: !isEditMode,
    });
  };

  render() {
    let tutorialTitle: string;
    let bodyContent: React.ReactNode;

    let { tuture, diff } = this.props;
    const { isEditMode } = this.state;

    tuture = JSON.parse(tuture as string);
    diff = JSON.parse(diff as string);

    if (
      !tuture ||
      tutureUtilities.isObjectEmpty(tuture) ||
      !diff ||
      !tutureUtilities.isArray(diff)
    ) {
      bodyContent = null;
    } else {
      const commits = extractCommits(tuture as Tuture);
      tutorialTitle = extractMetaData(tuture as Tuture).name;
      bodyContent = [
        <SideBarLeft commits={commits} />,
        <Content tuture={tuture} diff={diff} isEditMode={isEditMode} />,
      ];
    }

    return (
      <div>
        <Helmet>
          <title>{tutorialTitle}</title>
        </Helmet>
        <Header
          toggleEditMode={this.toggleEditMode}
          isEditMode={this.state.isEditMode}
        />
        <AppContent>{bodyContent}</AppContent>
      </div>
    );
  }
}
