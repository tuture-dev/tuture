import React from 'react';
import styled from 'styled-components';

import StepList, { StepListProps } from './StepList';

/* tslint:disable-next-line */
const SideBarRightWrapper = styled.div`
  width: 220px;
  background-color: rgba(216, 216, 216, 0.1);
  height: 637px;
  margin-top: 40px;
  position: fixed;
`;

export default class SideBarLeft extends React.Component<StepListProps> {
  render() {
    const { commits, selectKey, updateSelect } = this.props;
    return (
      <SideBarRightWrapper>
        <StepList
          commits={commits}
          selectKey={selectKey}
          updateSelect={updateSelect}
        />
      </SideBarRightWrapper>
    );
  }
}
