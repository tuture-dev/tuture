import React from 'react';
import styled from 'styled-components';

import { ModeContext } from './App';
import { rem } from '../utils/common';
import Icon from './common/Icon';

const HeaderWrapper = styled.div`
  position: fixed;
  top: 80vh;
  height: 60px;
  right: ${rem(160)}rem;
  background-color: rgba(255, 255, 255, 0);
  z-index: 9999;
`;

const Button = styled.button`
  height: 60px;
  width: 60px;
  border-radius: 50%;
  font-size: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-color: ${(props: { isEditMode: boolean }) =>
    props.isEditMode ? 'transparent' : '#00B887'};
  background-color: ${(props: { isEditMode: boolean }) =>
    props.isEditMode ? '#00B887' : 'white'};
  outline: none;
  &:hover {
    cursor: pointer;
    transition: box-shadow 0.3s;
    box-shadow: 0 5px 20px 5px #ddd;
  }
`;

export default class Header extends React.PureComponent {
  render() {
    const editButton = (
      <Icon
        name="icon-write"
        customStyle={{
          width: '19px',
          height: '17px',
          fill: '#FFF',
          unHoveredFill: '#FFF',
        }}
      />
    );

    const saveIcon = (
      <Icon
        name="icon-save"
        customStyle={{
          width: '18px',
          height: '18px',
          unHoveredFill: '#FFF',
        }}
      />
    );
    return (
      <ModeContext.Consumer>
        {({ isEditMode, toggleEditMode }) => (
          <HeaderWrapper>
            <div>
              <Button onClick={toggleEditMode} isEditMode={isEditMode}>
                {isEditMode ? saveIcon : editButton}
              </Button>
            </div>
          </HeaderWrapper>
        )}
      </ModeContext.Consumer>
    );
  }
}
