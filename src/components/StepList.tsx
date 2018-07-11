import React from 'react';
import styled from 'styled-components';

import { TutureMeta, Commit } from '../types';
import { MenuHeader, MenuHeaderText } from './SideBarLeft';

interface UpdateSelectFunc {
  (key: number): void;
}

export interface StepListProps {
  selectKey: number;
  updateSelect: UpdateSelectFunc;
  commits: Commit[];
  metadata: TutureMeta;
}

/* tslint:disable-next-line */
const TutureSteps = styled.div`
  width: 100%;
  height: 637px;
`;

/* tslint:disable-next-line */
const MenuHeader = styled.div`
  width: 100%;
  height: 134px;
  background-color: #d7efee;
`;

/* tslint:disable-next-line */
const MenuHeaderText = styled.p`
  font-family: STSongti-SC-Bold;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.84);
  width: 53px;
  margin: 0;
  padding-left: 24px;
  padding-top: 44px;
`;

/* tslint:disable-next-line */
const TutureMenu = styled.ul`
  height: 503px;
  background-color: rgba(216, 216, 216, 0.1);
  overflow-y: scroll;
  overflow-x: hidden;
  font-size: 14px;
  margin: 0;
  padding: 0;
  padding-top: 10px;
  outline: none;
  list-style: none;
  color: rgba(0, 0, 0, 0.65);
`;

/* tslint:disable-next-line */
const TutureMenuItem = styled.li`
  width: 100%;
  font-family: STSongti-SC-Bold;
  font-size: 16px;
  margin: 8px 0;
  padding-left: ${(props: any) =>
    props.className === 'selected' ? '38px' : '41px'};
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  display: block;
  white-space: nowrap;
  color: ${(props: any) =>
    props.className === 'selected'
      ? 'rgba(0, 0, 0, 0.84)'
      : 'rgba(0, 0, 0, 0.54)'};
  border-left: ${(props: any) =>
    props.className === 'selected' ? '3px solid rgba(0, 0, 0,0.84)' : 'none'};
`;

export default class StepList extends React.Component<StepListProps> {
  render() {
    const { commits, metadata, selectKey, updateSelect } = this.props;

    return (
      <TutureSteps>
        <MenuHeader>
          <MenuHeaderText>教程目录</MenuHeaderText>
        </MenuHeader>
        <TutureMenu>
          {commits.map((item, key) => (
            <TutureMenuItem
              className={key === selectKey ? 'selected' : ''}
              onClick={() => {
                this.props.updateSelect(key);
              }}
              key={key}>
              {item.name}
            </TutureMenuItem>
          ))}
        </TutureMenu>
      </TutureSteps>
    );
  }
}

export { TutureSteps, TutureMenu, TutureMenuItem };
