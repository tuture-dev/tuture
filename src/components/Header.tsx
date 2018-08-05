import React from 'react';
import styled from 'styled-components';

export interface HeaderProps {
  isEditMode: boolean;
  toggleEditMode: () => void;
}

/* tslint:disable-next-line */
const HeaderContent = styled.div`
  max-width: 1080px;
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
  background-color: white;
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
    props.isEditMode ? '#FFF' : 'rgba(0, 0, 0, 0.84)'};
  border-color: ${(props: { isEditMode: boolean }) =>
    props.isEditMode ? 'transparent' : 'rgba(0, 0, 0, 0.68)'};
  background-color: ${(props: { isEditMode: boolean }) =>
    props.isEditMode ? 'rgba(0,0,0,.54)' : 'white'};
  &: hover {
    cursor: pointer;
    outline: none;
  }
`;

export default class Header extends React.Component<HeaderProps, any> {
  public render() {
    const { isEditMode, toggleEditMode } = this.props;
    return (
      <HeaderWrapper>
        <HeaderContent>
          <Button onClick={toggleEditMode} isEditMode={isEditMode}>
            {isEditMode ? '保存' : '编辑'}
          </Button>
        </HeaderContent>
      </HeaderWrapper>
    );
  }
}
