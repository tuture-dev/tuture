import React from 'react';

import { TutureMeta } from '../types/';

export interface IntroductionProps {
  introduction: TutureMeta | string;
  staticContext?: any;
}

export interface IntroductionState {
  introduction: TutureMeta | string;
}

export default class Introduction extends React.Component<
  IntroductionProps,
  IntroductionState
> {
  render() {
    const { introduction } = this.props;
    return <div>{introduction && (introduction as TutureMeta).name}</div>;
  }
}
