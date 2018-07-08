import React from 'react';
import styled from 'styled-components';

import StepDiff from './StepDiff';

import { Step, DiffItem } from '../types';

import tutureUtilities from '../utils';

interface ChangeViewFunc {
  (): void;
}

interface StepContentProps {
  viewType: 'unified' | 'split';
  content: Step;
  diffItem: DiffItem;
}

interface StepContentState {
  viewType: 'unified' | 'split';
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
  static defaultProps = {
    viewType: 'unified',
  };

  constructor(props: StepContentProps) {
    super(props);
    this.state = {
      viewType: this.props.viewType,
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
    const { content, viewType, diffItem } = this.props;
    const { name, explain, diff, commit } = content;

    return (
      <TutureContent>
        <TutureContentHeader>
          <h1>{name}</h1>
          <button onClick={this.changeViewType}>{viewType}</button>
        </TutureContentHeader>
        {this.renderExplain(explain)}
        <StepDiff
          diff={diff}
          diffItem={diffItem}
          commit={commit}
          viewType={viewType}
          renderExplain={this.renderExplain}
        />
      </TutureContent>
    );
  }
}
