/* tslint:disable-next-line */
import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import { Helmet } from 'react-helmet';
import { Route, Switch, Redirect } from 'react-router-dom';

import Introduction from './Introduction';
import SideBarLeft from './SideBarLeft';
import StepContent from './StepContent';

import tutureUtilities from '../utils';
import { Commit, TutureMeta, Step, DiffItem } from '../types/';

interface AppState {
  selectKey: number;
}

export interface AppProps {
  introduction?: string | TutureMeta;
  commits?: string | Commit[];
  content?: string | Step;
  diffItem?: string | DiffItem;
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
    };
  }

  updateSelect = (key: number): void => {
    this.setState({
      selectKey: key,
    });
  };

  render() {
    let bodyContent: React.ReactNode;

    let { commits, introduction, content, diffItem } = this.props;

    if (content) {
      commits = JSON.parse(commits as string);
      introduction = JSON.parse(introduction as string);
      content = JSON.parse(content as string);
      diffItem = JSON.parse(diffItem as string);
    } else {
      commits = JSON.parse(commits as string);
      introduction = JSON.parse(introduction as string);
    }

    const { selectKey } = this.state;
    bodyContent = [
      <SideBarLeft
        commits={commits as Commit[]}
        selectKey={selectKey}
        updateSelect={this.updateSelect}
      />,
      <Switch>
        <Route
          exact={true}
          path="/steps"
          render={() => <Introduction introduction={introduction} />}
        />
        <Route
          exact={true}
          path="/steps/:commit/"
          render={() => (
            <StepContent
              content={content as Step}
              diffItem={diffItem as DiffItem}
            />
          )}
        />
        <Redirect from="/" to="/steps" />
      </Switch>,
    ];

    const tutorialTitle = (introduction as TutureMeta).name;

    return (
      <AppWrapper>
        <Helmet>
          <title>{tutorialTitle}</title>
        </Helmet>
        {bodyContent}
      </AppWrapper>
    );
  }
}

/* tslint:disable-next-line */
export const LanguageContext = React.createContext('textile');
