import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import { AppProps } from './App';
import StepContent from './StepContent';
import Brief from './Brief';

interface ContentProps extends AppProps {}

/* tslint:disable-next-line */
const ContentWrapper = styled.div`
  margin-top: -32px;
`;

@inject('store')
@observer
export default class Content extends React.Component<ContentProps> {
  public render() {
    const { store, diff } = this.props;
    const renderContent: any = [];

    const briefInfo = {
      userAvatar:
        'https://static.tuture.co/5b8bcccf0ff7ab20e243c552/avatar_small',
      userName: 'Tom Huang',
      publishTime: '2018 年 9 月 3 日',
      timeNeeded: 0.06,
      briefTitle: 'Git 原理详解及使用指南',
      briefDescribe: `随着这几年 GitHub 的流行，Git已经是一个程序员逃不过的技术项，
        但很多人却纷纷倒在了学习它的路上。而且，出于工作原因而不得不用Git 的人，
        有不少在工作中对 Git也是能不用就不用，生怕哪个命令用错就把公司的代码库毁掉了🙈。
        而那些对Git 掌握得比较好的少数人，就像团队中的神一样，在同事遇到 Git相关的问题的时候用各种风骚操作来拯救队友于水火。`,
      techTag: ['JavaScript', 'Jest', 'Webpack'],
    };

    store.tuture.steps.map((step, index: number) => {
      const diffItem = diff[index];

      renderContent.push(
        <StepContent
          key={index}
          content={step}
          index={index}
          diffItem={diffItem}
        />,
      );
    });

    return (
      <ContentWrapper>
        <Brief key="Brief" briefInfo={briefInfo} />,{renderContent}
      </ContentWrapper>
    );
  }
}
