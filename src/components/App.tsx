import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import { inject, observer } from 'mobx-react';

import SideBarLeft from './SideBarLeft';
import SideBarRight from './SideBarRight';
import { DiffItem } from './DiffView';
import Content from './Content';
import { extractCommits } from '../utils/extractors';
import Header from './Header';
import { handleAnchor, vwDesign, vwFontsize } from '../utils/common';
import Store from './store';

export interface AppProps {
  tuture?: Tuture | string;
  diff?: DiffItem[] | string;
  store?: Store;
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
export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    let { tuture, diff } = props;
    const { store } = props;
    tuture = JSON.parse(tuture as string);
    diff = JSON.parse(diff as string);
    const nowAnchorName = (tuture as Tuture).steps[0].name;
    store.setTuture(tuture as Tuture);
    store.nowSelected = handleAnchor(nowAnchorName);

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

    const { diff } = this.state;
    const { store } = this.props;
    const { tuture } = store;

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
      <ModeContext.Provider
        value={{
          toggleEditMode: this.toggleEditMode,
        }}>
        <Header />
        <AppContent>{bodyContent}</AppContent>
      </ModeContext.Provider>
    );
  }
}
