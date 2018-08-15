import React from 'react';
import styled from 'styled-components';

import StepList, { StepListProps } from './StepList';

/* tslint:disable-next-line */
export const SideBarLeftWrapper = styled.div`
  width: 270px;
  background-color: rgba(216, 216, 216, 0.1);
  margin-top: 32px;
  height: 637px;
  position: fixed;
`;

export default class SideBarLeft extends React.Component<StepListProps> {
  render() {
    const { commits } = this.props;
    return (
      <SideBarLeftWrapper>
        <StepList commits={commits} />
      </SideBarLeftWrapper>
    );
  }
}
