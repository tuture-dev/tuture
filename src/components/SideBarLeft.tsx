import React from 'react';

export interface SideBarLeftProps {}

export interface SideBarLeftState {}

export default class SideBarLeft extends React.Component<
  SideBarLeftProps,
  SideBarLeftState
> {
  constructor(props: SideBarLeftProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <div />;
  }
}
