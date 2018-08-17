import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import fetch from 'isomorphic-fetch';

import SideBarLeft from './SideBarLeft';
import SideBarRight from './SideBarRight';
import { DiffItem } from './DiffView';
import Content from './Content';
import { Tuture, Step } from '../types/';
import { extractCommits, extractMetaData } from '../utils/extractors';
import Header from './Header';
import { reorder, handleAnchor } from '../utils/common';

export interface AppProps {
  tuture?: Tuture | string;
  diff?: DiffItem[] | string;
}

interface AppState extends AppProps {
  isEditMode: boolean;
  nowSelected: string;
}

/* tslint:disable-next-line */
const AppContent = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  margin-top: 60px;
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

export const ModeContext = React.createContext({
  isEditMode: true,
  toggleEditMode: () => {},
});

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    let { tuture, diff } = this.props;
    tuture = JSON.parse(tuture as string);
    diff = JSON.parse(diff as string);
    const nowAnchorName = (tuture as Tuture).steps[0].name;

    this.state = {
      tuture,
      diff,
      isEditMode: true,
      nowSelected: handleAnchor(nowAnchorName),
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
    tuture.steps.filter((step, index) => {
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
    tuture.steps.filter((step, index) => {
      if (step.commit === commit) {
        stepIndex = index;
      }
    });
    const step = tuture.steps[stepIndex];
    step.diff = reorder(step.diff, sourceIndex, destinationIndex);
    this.setState({ tuture });
  };

  setSelect = (nowSelected: string) => {
    const { tuture } = this.state;
    const nowAnchorName = (tuture as Tuture).steps[0].name;
    this.setState({
      nowSelected: nowSelected ? nowSelected : handleAnchor(nowAnchorName),
    });
  };

  updateTuture = (tuture: Tuture) => {
    this.setState({ tuture });
  };

  render() {
    let tutorialTitle: string;
    let bodyContent: React.ReactNode;

    const { isEditMode, tuture, diff, nowSelected } = this.state;
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
        <SideBarLeft
          setSelect={this.setSelect}
          commits={commits}
          key="SiderBarLeft"
        />,
        <Content
          tuture={tuture}
          diff={diff}
          updateTutureExplain={this.updateTutureExplain}
          updateTutureDiffOrder={this.updateTutureDiffOrder}
          key="Content"
        />,
        isEditMode && (
          <SideBarRight
            key="SideBarRight"
            isEditMode={isEditMode}
            nowSelected={nowSelected}
            tuture={tuture as Tuture}
            updateTuture={this.updateTuture}
          />
        ),
      ];
    }

    return (
      <ModeContext.Provider
        value={{
          isEditMode: this.state.isEditMode,
          toggleEditMode: this.toggleEditMode,
        }}>
        <Header />
        <AppContent>{bodyContent}</AppContent>
      </ModeContext.Provider>
    );
  }
}
