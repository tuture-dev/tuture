import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import { inject, observer } from 'mobx-react';
import { translate } from 'react-i18next';
import { Helmet } from 'react-helmet';

import SideBarLeft from './SideBarLeft';
import SideBarRight from './SideBarRight';
import { DiffItem } from './DiffView';
import Content from './Content';
import { extractCommits, handleAnchor, vwDesign, vwFontsize } from '../utils';
import Header from './Header';
import Store from '../store';

export interface AppProps {
  tuture?: Tuture | string;
  diff?: DiffItem[] | string;
  store?: Store;
  i18n?: any;
}

interface AppState extends AppProps {}

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

    const { tuture, diff, i18n, store } = props;
    const nowAnchorName = (tuture as Tuture).steps[0].name;
    store.setTuture(tuture as Tuture);
    store.nowSelected = handleAnchor(nowAnchorName);
    store.i18n = i18n;

    this.state = {
      diff,
    };
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

    const { diff } = this.state;
    const { store } = this.props;
    const { tuture } = store;

    if (tuture && tuture.name) {
      tutorialTitle = tuture.name;
    }

    if (
      !tuture ||
      Object.keys(tuture).length === 0 ||
      !diff ||
      !Array.isArray(diff)
    ) {
      bodyContent = null;
    } else {
      const commits = extractCommits(tuture as Tuture);
      bodyContent = [
        <SideBarLeft commits={commits} key="SiderBarLeft" />,
        <Content diff={diff} key="Content" />,
        this.props.store.isEditMode && <SideBarRight key="SideBarRight" />,
      ];
    }

    return (
      <ModeContext.Provider value={{ toggleEditMode: this.toggleEditMode }}>
        <Helmet>
          <title>{tutorialTitle}</title>
        </Helmet>
        <Header />
        <AppContent>{bodyContent}</AppContent>
      </ModeContext.Provider>
    );
  }
}

export default translate('translations')(App);
