/* tslint:disable-next-line */
import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import { Helmet } from 'react-helmet';
import yaml from 'js-yaml';

import Steps from './Steps';
import Content from './Content';

import tutureUtilities from '../utils/';
import { Tuture } from '../types/index';
import { handleSteps, handleStepsInfo } from '../utils/handleTuture';

interface AppState {
  selectKey: number;
  tuture: Tuture;
  viewType: string;
}

interface AppProps {
  // Page's title
  name?: string;
}

const AppWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`;

injectGlobal`
  html {
    font-size: 100%;
  }

  body {
    height: 100%;
    font-size: 10px;
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
    margin-top: 2em;
    border: 1px solid #e1e1e1;
  }

  .diff-file-header {
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
      viewType: 'unified',
    };
  }

  changeViewType = (): void => {
    const { viewType } = this.state;
    this.setState({
      viewType: viewType === 'unified' ? 'split' : 'unified',
    });
  }

  updateSelect = (key: number): void => {
    this.setState({
      selectKey: key,
    });
  }

  async loadTuture(): Promise<void> {
    const that = this;

    try {
      const response = await fetch('./tuture.yml');
      const content = await response.text();
      const tuture = yaml.safeLoad(content);
      that.setState({
        tuture: tuture as Tuture,
      });
    } catch (err) {
      // silent failed
    }
  }

  componentDidMount() {
    this.loadTuture();
  }

  render() {
    const { tuture } = this.state;
    let bodyContent: React.ReactNode;

    if (!tuture || tutureUtilities.isObjectEmpty(tuture)) {
      bodyContent = null;
    } else {
      const catalogs = handleSteps(tuture);
      const catalogsInfo = handleStepsInfo(tuture);
      const { selectKey, viewType } = this.state;
      const nowRenderContent = tuture.steps[this.state.selectKey];
      bodyContent = [
        <Steps
          key="steps"
          catalogs={catalogs}
          catalogsInfo={catalogsInfo}
          selectKey={selectKey}
          updateSelect={this.updateSelect}
        />,
        <Content
          key="content"
          content={nowRenderContent}
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
        {bodyContent}
      </AppWrapper>
    );
  }
}
