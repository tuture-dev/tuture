import React from 'react';

export interface SideBarRightProps {}

export interface SideBarRightState {}

export default class SideBarRight extends React.Component<
  SideBarRightProps,
  SideBarRightState
> {
  constructor(props: SideBarRightProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <div />;
  }
}
