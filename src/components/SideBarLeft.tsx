import React from 'react';
import styled from 'styled-components';

export interface SideBarLeftProps {}

export interface SideBarLeftState {}

/* tslint:disable-next-line */
const SideBarLeftWrapper = styled.div`
  min-width: 180px;
  height: 630px;
  background-color: rgba(216, 216, 216, 0.1);
`;

/* tslint:disable-next-line */
const MenuHeader = styled.div`
  width: 100%;
  height: 134px;
  background-color: #d7efee;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/* tslint:disable-next-line */
const MenuHeaderText = styled.p`
  font-family: STSongti-SC-Bold;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.84);
`;

export default class SideBarLeft extends React.Component<
  SideBarLeftProps,
  SideBarLeftState
> {
  constructor(props: SideBarLeftProps) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <SideBarLeftWrapper>
        <MenuHeader>
          <MenuHeaderText>本节目录</MenuHeaderText>
        </MenuHeader>
      </SideBarLeftWrapper>
    );
  }
}
