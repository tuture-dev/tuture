import React from 'react';

import { SideBarLeftWrapper } from './SideBarLeft';

export interface SideBarRightProps {}

export interface SideBarRightState {
  top?: number;
}

/* tslint:disable-next-line */
const SideBarRightWrapper = SideBarLeftWrapper.extend`
  width: 270px;
  background-color: rgba(216, 216, 216, 0.1);
  height: 637px;
  margin-top: 32px;
  position: fixed;
  left: 1145px;
`;

export default class SideBarRight extends React.Component<
  SideBarRightProps,
  SideBarRightState
> {
  render() {
    return <SideBarRightWrapper>hhhhhhhhhh</SideBarRightWrapper>;
  }
}
