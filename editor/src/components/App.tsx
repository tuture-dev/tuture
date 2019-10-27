import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import { inject, observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { Helmet } from 'react-helmet';

import SideBarLeft from './SideBarLeft';
import SideBarRight from './SideBarRight';
import { DiffItem } from './DiffView';
import Content from './Content';
import { Tuture } from '../../../types';
import { extractCommits, handleAnchor, vwDesign, vwFontsize } from '../utils';
import Header from './Header';
import Store from '../store';
import NoCommit from './NoCommit.png';

export interface AppProps {
  tuture?: Tuture | string;
  diff?: DiffItem[] | string;
  store?: Store;
  i18n?: any;
}

interface AppState extends AppProps {
  hasCommit?: boolean;
}

const AppContent = styled.div`
  width: 86%;

  @media (max-width: 1408px) {
    width: 90%;
  }

  @media (max-width: 1206px) {
    width: 94%;
  }

  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 60px;
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

injectGlobal`
  html {
    font-size: ${(vwFontsize / vwDesign) * 100}vw;
    min-width: 1080px;
  }

  body {
    height: 100%;
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
    font-family: Roboto;
  }

  #root {
    height: 100%;
    margin-top: 10px;
    margin-bottom: 70px;
  }

  h1 {
    font-size: 45px;
  }

  .showSideBar {
    opacity: 1;
  }

  .hideSideBar {
    opacity: 0;
  }
`;

export const ModeContext = React.createContext({
  toggleEditMode: () => {},
});

@inject('store')
@observer
class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    const { tuture } = props;

    // Judge whether project has commit
    if (
      tuture &&
      (tuture as Tuture).steps &&
      Array.isArray((tuture as Tuture).steps) &&
      (tuture as Tuture).steps.length > 0
    ) {
      const { diff, i18n, store } = props;
      const nowAnchorName = (tuture as Tuture).steps[0].name;
      store.setTuture(tuture as Tuture);
      store.nowSelected = handleAnchor(nowAnchorName);
      store.i18n = i18n;

      this.state = {
        diff,
        hasCommit: true,
      };
    } else {
      this.state = {
        hasCommit: false,
      };
    }
  }

  toggleEditMode = () => {
    const { store } = this.props;
    store.updateIsEditMode();
    if (!store.isEditMode) {
      store.saveTuture();
    }
  };

  render() {
    let bodyContent: React.ReactNode;
    let tutorialTitle = '图雀';

    const hasCommit = false;

    if (hasCommit) {
      const { diff } = this.state;
      const { store } = this.props;
      const { tuture } = store;

      if (tuture && tuture.name) {
        tutorialTitle = tuture.name;
      }

      const commits = extractCommits(tuture as Tuture);
      bodyContent = [
        <SideBarLeft commits={commits} key="SiderBarLeft" />,
        <Content diff={diff} key="Content" />,
        this.props.store.isEditMode && <SideBarRight key="SideBarRight" />,
      ];
    } else {
      bodyContent = (
        <NoCommitContainer>
          <NoCommitLogo src={NoCommit} alt="" />
          <NoCommitText>Oops！ 此项目还没有任何 commit 哦！</NoCommitText>
        </NoCommitContainer>
      );
    }

    return (
      <ModeContext.Provider value={{ toggleEditMode: this.toggleEditMode }}>
        <Helmet>
          <title>{tutorialTitle}</title>
        </Helmet>
        {hasCommit && <Header />}
        {hasCommit && <AppContent>{bodyContent}</AppContent>}
        {!hasCommit && bodyContent}
      </ModeContext.Provider>
    );
  }
}

export default translate('translations')(App);
