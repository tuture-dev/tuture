import React from 'react';
import styled from 'styled-components';

import { TutureMeta, Commit } from '../types';

interface UpdateSelectFunc {
  (key: number): void;
}

interface StepListProps {
  selectKey: number;
  updateSelect: UpdateSelectFunc;
  commits: Commit[];
  metadata: TutureMeta;
}

/* tslint:disable-next-line */
const TutureSteps = styled.div`
  width: 20%;
  height: 100%;
  overflow: scroll;
  border-right: 1px solid #e8e8e8;
`;

/* tslint:disable-next-line */
const TutureMenu = styled.ul`
  height: 100%;
  overflow: scroll;
  font-size: 14px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  outline: none;
  margin-bottom: 0;
  padding-left: 0;
  list-style: none;
  color: rgba(0, 0, 0, 0.65);
  line-height: 0;
  background: #fff;
  -webkit-transition: background 0.3s, width 0.2s;
  transition: background 0.3s, width 0.2s;
  zoom: 1;
`;

/* tslint:disable-next-line */
const TutureMenuItem = styled.li`
  padding: 0 16px 0 30px;
  width: calc(100% + 1px);
  font-size: 14px;
  line-height: 40px;
  height: 40px;
  margin-top: 4px;
  margin-right: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  margin: 0;
  display: block;
  white-space: nowrap;
  border-right: ${(props: any) =>
    props.className === 'selected' ? '4px solid #1890ff' : 'none'};
  color: ${(props: any) =>
    props.className === 'selected' ? '#1890ff' : '#000000'};
  background-color: ${(props: any) =>
    props.className === 'selected' ? '#e6f7ff' : '#FFFFFF'};
`;

export default class StepList extends React.Component<StepListProps> {
  render() {
    const { commits, metadata, selectKey, updateSelect } = this.props;

    return (
      <TutureSteps>
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
