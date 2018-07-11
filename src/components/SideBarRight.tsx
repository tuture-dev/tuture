import React from 'react';
import styled from 'styled-components';

import StepList, { StepListProps } from './StepList';

export interface SideBarRightProps extends StepListProps {
  changeViewType: () => void;
  viewType: 'Unified' | 'Split';
}

/* tslint:disable-next-line */
const SideBarRightWrapper = styled.div`
  min-width: 328px;
  background-color: rgba(216, 216, 216, 0.1);
  height: 637px;
`;

/* tslint:disable-next-line */
const ButtonWrapper = styled.div`
  margin-top: 41px;
`;

/* tslint:disable-next-line */
const Button = styled.button`
  width: 100%;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.54);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.04);
  border-radius: 3px;
  font-family: Avenir-Medium;
  font-size: 23px;
  padding: 30px 0;
  color: rgba(0, 0, 0, 0.54);
  outline: none;
  &:hover {
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.09);
  }
`;

export default class SideBar extends React.Component<SideBarRightProps> {
  render() {
    const {
      commits,
      metadata,
      selectKey,
      updateSelect,
      viewType,
      changeViewType,
    } = this.props;
    return (
      <SideBarRightWrapper>
        <StepList
          commits={commits}
          metadata={metadata}
          selectKey={selectKey}
          updateSelect={updateSelect}
        />
        <ButtonWrapper>
          <Button onClick={changeViewType}>{viewType}</Button>
        </ButtonWrapper>
      </SideBarRightWrapper>
    );
  }
}
