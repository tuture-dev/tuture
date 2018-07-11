/* tslint:disable-next-line */
import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import { Helmet } from 'react-helmet';

import SideBarLeft from './SideBarLeft';
import SideBarRight from './SideBarRight';
import StepContent from './StepContent';

import tutureUtilities from '../utils';
import { Tuture, DiffItem } from '../types/';
import { extractCommits, extractMetaData } from '../utils/extractors';

interface AppState {
  selectKey: number;
  tuture: Tuture;
  diff: DiffItem[];
  viewType: 'Unified' | 'Split';
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
  }

  .diff-hunk-header {
    display: none;
  }

  .diff-file {
    font-size: 12px;
    margin-top: 2em;
    border: 1px solid #e1e1e1;
  }

  .diff-file-header {
    font-size: 14px;
    background-color: #f7f7fa;
    line-height: 3;
    padding-left: 1em;
    border-bottom: 1px solid #e1e1e1;

    display: -webkit-box;

    display: -ms-flexbox;

    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .filename {
    margin-right: 1em;
  }

  .addition-count {
    margin-right: 1em;
    color: #88b149;
  }

  .deletion-count {
    margin-right: 1em;
    color: #ee5b60;
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
      viewType: 'Unified',
    };
  }

  updateSelect = (key: number): void => {
    this.setState({
      selectKey: key,
    });
  };

  changeViewType = (): void => {
    const { viewType } = this.state;
    this.setState({
      viewType: viewType === 'Unified' ? 'Split' : 'Unified',
    });
  };

  async loadTuture() {
    try {
      const that = this;
      const response = await fetch('./tuture.json');
      const tuture = await response.json();
      that.setState({
        tuture: tuture as Tuture,
      });
    } catch (err) {
      // silent failed
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
      const { selectKey, viewType } = this.state;
      const nowRenderContent = tuture.steps[selectKey];
      const diffItem = diff[selectKey];
      bodyContent = [
        <SideBarLeft />,
        <StepContent
          key="content"
          content={nowRenderContent}
          diffItem={diffItem}
          viewType={viewType}
        />,
        <SideBarRight
          commits={commits}
          metadata={metadata}
          selectKey={selectKey}
          updateSelect={this.updateSelect}
          viewType={viewType}
          changeViewType={this.changeViewType}
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
