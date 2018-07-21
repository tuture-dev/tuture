import React from 'react';
import styled from 'styled-components';

import { TutureMeta, Commit } from '../types';
import ReactSVG from 'react-svg';
import catalogImage from './images/catalog-image.svg';

interface UpdateSelectFunc {
  (key: number): void;
}

export interface StepListProps {
  selectKey: number;
  updateSelect: UpdateSelectFunc;
  commits: Commit[];
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
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
`;

/* tslint:disable-next-line */
const MenuHeaderText = styled.p`
  font-family: STSongti-SC-Bold;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.84);
`;

/* tslint:disable-next-line */
const TutureMenu = styled.ul`
  height: 503px;
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
  width: ${(props) =>
    props.className === 'selected' ? 'calc(100% -38px)' : 'calc(100% -41px)'};
  font-family: STSongti-SC-Bold;
  font-size: 16px;
  margin: 8px 0;
  padding-right: 40px;
  padding-left: ${(props: any) =>
    props.className === 'selected' ? '38px' : '41px'};
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  display: block;
  color: ${(props: any) =>
    props.className === 'selected'
      ? 'rgba(0, 0, 0, 0.84)'
      : 'rgba(0, 0, 0, 0.54)'};
  border-left: ${(props: any) =>
    props.className === 'selected' ? '3px solid rgba(0, 0, 0,0.84)' : 'none'};
`;

/* tslint:disable-next-line */
const MenuItemContent = styled.div`
  width: 159px;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
`;

/* tslint:disable-next-line */
const MenuHeaderImage = styled(ReactSVG)`
  width: 158px;
  margin-bottom: -7px;
`;

/* tslint:disable-next-line */
const MenuItemIcon = styled.img`
  width: 22px;
  margin: 3px 16px 3px 0;
`;

export default class StepList extends React.Component<StepListProps> {
  render() {
    const { commits, selectKey, updateSelect } = this.props;

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
                updateSelect(key);
              }}
              key={key}>
              <MenuItemContent>{item.name}</MenuItemContent>
            </TutureMenuItem>
          ))}
        </TutureMenu>
      </TutureSteps>
    );
  }
}

export { TutureSteps, TutureMenu, TutureMenuItem };
