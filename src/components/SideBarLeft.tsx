import React from 'react';
import styled from 'styled-components';

import StepList, { StepListProps } from './StepList';
import { rem } from '../utils/common';

/* tslint:disable-next-line */
export const SideBarLeftWrapper = styled.div`
  width: ${rem(270)}rem;
  min-width: 200px;
  height: 637px;
  margin-top: 20px;
  position: fixed;
  transition: opacity 0.5s;
`;

export default class SideBarLeft extends React.Component<StepListProps> {
  render() {
    const { commits, className } = this.props;
    return (
      <SideBarLeftWrapper className={className}>
        <StepList commits={commits} />
      </SideBarLeftWrapper>
    );
  }
}
