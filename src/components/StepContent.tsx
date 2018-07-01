import React from 'react';
import styled from 'styled-components';

import StepDiff from './StepDiff';

import { Step } from '../types';

import tutureUtilities from '../utils';

interface ChangeViewFunc {
  (): void;
}

interface StepContentProps {
  viewType: string;
  changeViewType: ChangeViewFunc;
  content: Step;
}

interface StepContentState {
  viewType: string;
}

/* tslint:disable-next-line */
const TutureContent = styled.div`
  width: 80%;
  padding: 30px;
  height: 100%;
  overflow-y: scroll;
`;

/* tslint:disable-next-line */
const TutureContentHeader = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
`;

export default class StepContent extends React.Component<
  StepContentProps,
  StepContentState
> {
  constructor(props: StepContentProps) {
    super(props);

    this.state = {
      viewType: 'unified',
    };
  }

  renderExplain = (
    explain: string[] | string,
  ): React.ReactNode | React.ReactNodeArray => {
    if (tutureUtilities.isArray(explain)) {
      const arrExplain = explain as string[];
      return arrExplain.map((explainItem: string, i: number) => (
        <p key={i}>{explainItem}</p>
      ));
    }

    return <p>{explain}</p>;
  };

  changeViewType = (): void => {
    const { viewType } = this.state;
    this.setState({
      viewType: viewType === 'unified' ? 'split' : 'unified',
    });
  };

  render() {
    const { content, viewType, changeViewType } = this.props;
    const { name, explain, diff, commit } = content;

    return (
      <TutureContent>
        <TutureContentHeader>
          <h1>{name}</h1>
          <button onClick={changeViewType}>{viewType}</button>
        </TutureContentHeader>
        {this.renderExplain(explain)}
        <StepDiff
          diff={diff}
          commit={commit}
          viewType={viewType}
          renderExplain={this.renderExplain}
        />
      </TutureContent>
    );
  }
}
