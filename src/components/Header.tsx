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
  justify-content: flex-end;
`;

export default class Header extends React.Component<HeaderProps, any> {
  public render() {
    const { isEditMode, toggleEditMode } = this.props;
    return (
      <div>
        <HeaderContent>
          <button onClick={toggleEditMode}>
            {isEditMode ? '保存' : '编辑'}
          </button>
        </HeaderContent>
      </div>
    );
  }
}
