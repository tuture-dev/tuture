import React from 'react';
import styled from 'styled-components';

import StepList, { StepListProps } from './StepList';

export interface SideBarRightProps extends StepListProps {
  changeViewType: () => void;
  viewType: 'unified' | 'split';
}

/* tslint:disable-next-line */
const SideBarRightWrapper = styled.div`
  width: 20%;
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
        <div>
          <button onClick={changeViewType}>{viewType}</button>
        </div>
      </SideBarRightWrapper>
    );
  }
}
