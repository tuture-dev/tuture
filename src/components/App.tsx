/* tslint:disable-next-line */
import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import fetch from 'isomorphic-fetch';

import SideBarLeft from './SideBarLeft';
import { DiffItem } from './DiffView';
import Content from './Content';
import { Tuture } from '../types/';
import { extractCommits, extractMetaData } from '../utils/extractors';
import Header from './Header';
import { reorder } from '../utils/common';

export interface AppProps {
  tuture?: Tuture | string;
  diff?: string | DiffItem[] | string;
}

interface AppState extends AppProps {
  isEditMode: boolean;
}

/* tslint:disable-next-line */
const AppContent = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  margin-top: 92px;
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
    margin-top: 10px;
    margin-bottom: 70px;
  }

  h1 {
    font-size: 45px;
  }
`;

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    let { tuture, diff } = this.props;
    ``;
    tuture = JSON.parse(tuture as string);
    diff = JSON.parse(diff as string);
    this.state = {
      tuture,
      diff,
      isEditMode: false,
    };
  }

  saveTuture = () => {
    const { tuture } = this.state;
    fetch(`http://${location.host}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(tuture),
    });
  };

  toggleEditMode = () => {
    const { isEditMode } = this.state;
    if (isEditMode) {
      this.saveTuture();
    }
    this.setState({
      isEditMode: !isEditMode,
    });
  };

  updateTutureExplain = (
    commit: string,
    diffKey: string,
    name: 'pre' | 'post',
    value: string,
  ) => {
    let { tuture } = this.state;
    tuture = tuture as Tuture;
    let stepIndex = 0;
    const nowStep = tuture.steps.filter((step, index) => {
      if (step.commit === commit) {
        stepIndex = index;
      }
    });
    const step = tuture.steps[stepIndex];
    if (diffKey === 'root') {
      step.explain = { ...step.explain, [name]: value };
    } else {
      const diff = step.diff[parseInt(diffKey, 10)];
      diff.explain = { ...diff.explain, [name]: value };
    }

    this.setState({ tuture });
  };

  updateTutureDiffOrder = (
    commit: string,
    sourceIndex: number,
    destinationIndex: number,
  ) => {
    let { tuture } = this.state;
    tuture = tuture as Tuture;
    let stepIndex = 0;
    const nowStep = tuture.steps.filter((step, index) => {
      if (step.commit === commit) {
        stepIndex = index;
      }
    });
    const step = tuture.steps[stepIndex];
    step.diff = reorder(step.diff, sourceIndex, destinationIndex);
    this.setState({ tuture });
  };

  render() {
    let tutorialTitle: string;
    let bodyContent: React.ReactNode;

    const { isEditMode, tuture, diff } = this.state;
    if (
      !tuture ||
      Object.keys(tuture).length === 0 ||
      !diff ||
      !Array.isArray(diff)
    ) {
      bodyContent = null;
    } else {
      const commits = extractCommits(tuture as Tuture);
      tutorialTitle = extractMetaData(tuture as Tuture).name;
      bodyContent = [
        <SideBarLeft commits={commits} key="SiderbarLeft" />,
        <Content
          tuture={tuture}
          diff={diff}
          updateTutureExplain={this.updateTutureExplain}
          updateTutureDiffOrder={this.updateTutureDiffOrder}
          isEditMode={isEditMode}
          key="Content"
        />,
      ];
    }

    return (
      <div>
        <Header
          toggleEditMode={this.toggleEditMode}
          isEditMode={this.state.isEditMode}
        />
        <AppContent>{bodyContent}</AppContent>
      </div>
    );
  }
}
