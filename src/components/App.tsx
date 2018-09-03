import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import fetch from 'isomorphic-fetch';
import { inject, observer } from 'mobx-react';
import classnames from 'classnames';

import SideBarLeft from './SideBarLeft';
import SideBarRight from './SideBarRight';
import { DiffItem } from './DiffView';
import Content from './Content';
import { Tuture } from '../types/';
import { extractCommits } from '../utils/extractors';
import Header from './Header';
import Brief from './Brief';
import { handleAnchor, vwDesign, vwFontsize } from '../utils/common';
import Store from './store';

export interface AppProps {
  tuture?: Tuture | string;
  diff?: DiffItem[] | string;
  store?: Store;
}

interface AppState extends AppProps {
  showSideBar?: boolean;
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

injectGlobal`
  html {
    font-size: ${(vwFontsize / vwDesign) * 100}vw;
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
      showSideBar: false,
    };
  }

  saveTuture = () => {
    fetch(`http://${location.host}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(this.props.store.tuture),
    });
  };

  toggleEditMode = () => {
    const { store } = this.props;
    store.updateIsEditMode();
    if (!store.isEditMode) {
      this.saveTuture();
    }
  };

  toggleShowSideBar = (rs: boolean) => {
    this.setState({
      showSideBar: rs,
    });
  };

  render() {
    let bodyContent: React.ReactNode;

    const { diff } = this.state;
    const { tuture } = this.props.store;

    const briefInfo = {
      userAvatar: '../example',
      userName: 'Tom Huang',
      publishTime: '2018 年 6 月 6 日',
      timeNeeded: 4,
      briefTitle: 'Git 原理详解及使用指南',
      briefDescribe: `随着这几年 GitHub 的流行，Git已经是一个程序员逃不过的技术项，
        但很多人却纷纷倒在了学习它的路上。而且，出于工作原因而不得不用Git 的人，
        有不少在工作中对 Git也是能不用就不用，生怕哪个命令用错就把公司的代码库毁掉了🙈。
        而那些对Git 掌握得比较好的少数人，就像团队中的神一样，在同事遇到 Git相关的问题的时候用各种风骚操作来拯救队友于水火。`,
      techTag: ['JavaScript', 'Jest', 'Webpack'],
    };
    if (
      !tuture ||
      Object.keys(tuture).length === 0 ||
      !diff ||
      !Array.isArray(diff)
    ) {
      bodyContent = null;
    } else {
      const commits = extractCommits(tuture as Tuture);
      const { showSideBar } = this.state;
      const sideBarOpacity = classnames(
        { showSideBar },
        { hideSideBar: !showSideBar },
      );
      bodyContent = [
        <Brief
          key="Brief"
          briefInfo={briefInfo}
          toggleShowSideBar={this.toggleShowSideBar}
        />,
        <SideBarLeft
          commits={commits}
          className={sideBarOpacity}
          key="SiderBarLeft"
        />,
        <Content diff={diff} key="Content" />,
        this.props.store.isEditMode && (
          <SideBarRight key="SideBarRight" className={sideBarOpacity} />
        ),
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
