/* tslint:disable-next-line */
import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import { Helmet } from 'react-helmet';
import yaml from 'js-yaml';

import SideBarRight from './SideBarRight';
import StepContent from './StepContent';

import tutureUtilities from '../utils';
import { Tuture, DiffItem } from '../types/';
import { extractCommits, extractMetaData } from '../utils/extractors';

interface AppState {
  selectKey: number;
  tuture: Tuture;
  diff: DiffItem[];
}

interface AppProps {
  // Page's title
  name?: string;
}

/* tslint:disable-next-line */
const AppWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
`;

/* tslint:disable-next-line */
const AppContent = styled.div`
  max-width: 1355px;
  width: 1355px;
  display: flex;
`;

injectGlobal`
  html {
    font-size: 100%;
  }

  body {
    height: 100%;
    font-size: 16px;
    line-height: 1.5;
    margin: 0;
    padding: 0;
  }

  #root {
    height: 100%;
    margin-top: 70px;
    margin-bottom: 70px;
  }
`;

export default class App extends React.Component<AppProps, AppState> {
  static defaultProps = {
    name: 'My Awesome Tutorial',
  };

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

  async loadTuture() {
    try {
      const that = this;
      const response = await fetch('./tuture.yml');
      const tutureYAML = await response.text();
      const tuture = yaml.safeLoad(tutureYAML);
      that.setState({
        tuture: tuture as Tuture,
      });
    } catch (err) {
      // silent failed
      console.log('tuture.yml is not exists or tuture.yml format errors');
    }
  }

  async loadDiff() {
    try {
      const that = this;
      const response = await fetch('./diff.json');
      const diff = await response.json();
      that.setState({
        diff: diff as DiffItem[],
      });
    } catch (err) {
      // silent failed
      console.log('diff.json is not exists or diff.json format errors');
    }
  }

  componentDidMount() {
    this.loadTuture();
    this.loadDiff();
  }

  render() {
    let bodyContent: React.ReactNode;
    const { tuture, diff } = this.state;

    if (
      !tuture ||
      tutureUtilities.isObjectEmpty(tuture) ||
      !diff ||
      !tutureUtilities.isArray(diff)
    ) {
      bodyContent = null;
    } else {
      const commits = extractCommits(tuture);
      const metadata = extractMetaData(tuture);
      const { selectKey } = this.state;
      const nowRenderContent = tuture.steps[selectKey];
      const diffItem = diff[selectKey];
      bodyContent = [
        <StepContent
          key="content"
          content={nowRenderContent}
          diffItem={diffItem}
        />,
        <SideBarRight
          commits={commits}
          selectKey={selectKey}
          updateSelect={this.updateSelect}
        />,
      ];
    }

    return (
      <AppWrapper>
        <Helmet>
          <title>{name}</title>
        </Helmet>
        <AppContent>{bodyContent}</AppContent>
      </AppWrapper>
    );
  }
}

/* tslint:disable-next-line */
export const LanguageContext = React.createContext('textile');
