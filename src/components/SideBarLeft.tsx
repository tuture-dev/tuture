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
`;

export default class SideBarLeft extends React.Component<StepListProps> {
  render() {
    const { commits, setSelect } = this.props;
    return (
      <SideBarLeftWrapper>
        <StepList commits={commits} setSelect={setSelect} />
      </SideBarLeftWrapper>
    );
  }
}
