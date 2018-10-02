import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import StepList, { StepListProps } from './StepList';
import { rem } from '../utils';
import Icon from './Icon';

const StepListStatusControl = styled.button`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  width: 24px;
  color: #fff;
  box-sizing: border-box;
  background-color: #000;
  position: fixed;
  left: -24px;
  top: -1px;
  height: 101vh;
  transition: opacity 0.5s;
  outline: none;
  &:hover {
    cursor: pointer;
  }
  @media (max-width: 1200px) {
    left: ${(props: { sidebarDisplayStatus: boolean }) =>
      props.sidebarDisplayStatus ? '-24px' : '-1px'};
  }
  transition: left 0.5s;
`;

const SideBarLeftWrapper = styled.div`
  width: ${rem(270)}rem;
  height: 637px;
  margin-top: 20px;
  position: fixed;
  transition: opacity 0.5s;
  left: ${rem(100)}rem;
  text-align: center;
  @media (max-width: 1200px) {
    width: 270px;
    background: #fff;
    height: 101vh;
    margin-top: 0;
    top: 0;
    z-index: 10;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    left: ${(props: { sidebarDisplayStatus: boolean }) =>
      props.sidebarDisplayStatus ? 0 : '-270px'};
    transition: left 0.5s;
  }
`;

@inject('store')
@observer
export default class SideBarLeft extends React.Component<StepListProps> {
  render() {
    const { commits, store } = this.props;
    return (
      <SideBarLeftWrapper
        className={store.sidebarOpacityClass}
        sidebarDisplayStatus={store.sidebarDisplayStatus}>
        <StepList commits={commits} />
        {store.sidebarDisplayStatus && (
          <Icon
            name="icon-left"
            customStyle={{
              width: '32px',
              height: '32px',
              marginTop: '73px',
            }}
            onClick={store.toggleSidebarDisplayStatus}
          />
        )}
        <StepListStatusControl
          className={store.sidebarOpacityClass}
          onClick={store.toggleSidebarDisplayStatus}
          sidebarDisplayStatus={store.sidebarDisplayStatus}>
          <Icon
            name="icon-right"
            customStyle={{
              width: '11px',
              height: '24px',
            }}
          />
        </StepListStatusControl>
      </SideBarLeftWrapper>
    );
  }
}
