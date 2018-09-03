import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import StepList, { StepListProps } from './StepList';
import { rem } from '../utils/common';
import Store from './store';

/* tslint:disable-next-line */
export const SideBarLeftWrapper = styled.div`
  width: ${rem(270)}rem;
  min-width: 200px;
  height: 637px;
  margin-top: 20px;
  position: fixed;
  transition: opacity 0.5s;
`;

@inject('store')
@observer
export default class SideBarLeft extends React.Component<StepListProps> {
  render() {
    const { commits, store } = this.props;
    return (
      <SideBarLeftWrapper className={store.sidebarOpacityClass}>
        <StepList commits={commits} />
      </SideBarLeftWrapper>
    );
  }
}
