import React from 'react';
import styled from 'styled-components';

import { ModeContext } from './App';

/* tslint:disable-next-line */
const HeaderContent = styled.div`
  max-width: 988px;
  margin: 0 auto;
  display: flex;
  height: 100%;
  justify-content: flex-end;
  align-items: center;
`;

/* tslint:disable-next-line */
const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 60px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0);
`;

/* tslint:disable-next-line */
const Button = styled.button`
  border-radius: 4px;
  height: 30px;
  line-height: 30px;
  padding: 0 18px;
  font-size: 12px;
  box-sizing: border-box;
  margin-right: 34px;
  color: ${(props: { isEditMode: boolean }) =>
    props.isEditMode ? '#FFF' : '#00B887'};
  border-color: ${(props: { isEditMode: boolean }) =>
    props.isEditMode ? 'transparent' : '#00B887'};
  background-color: ${(props: { isEditMode: boolean }) =>
    props.isEditMode ? '#00B887' : 'white'};
  outline: none;
  &: hover {
    cursor: pointer;
  }
`;

export default class Header extends React.PureComponent {
  render() {
    return (
      <ModeContext.Consumer>
        {({ isEditMode, toggleEditMode }) => (
          <HeaderWrapper>
            <HeaderContent>
              <Button onClick={toggleEditMode} isEditMode={isEditMode}>
                {isEditMode ? '保存' : '编辑'}
              </Button>
            </HeaderContent>
          </HeaderWrapper>
        )}
      </ModeContext.Consumer>
    );
  }
}
