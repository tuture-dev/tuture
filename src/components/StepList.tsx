import React from 'react';
import styled from 'styled-components';

import { TutureMeta, Commit } from '../types';
import { handleAnchor, isClientOrServer } from '../utils/common';

export interface StepListProps {
  commits: Commit[];
}
export interface StepListState {
  nowSelected: string;
  itemTopOffsets: HTMLElement[];
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
  overflow-y: auto;
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
  font-family: STSongti-SC;
  font-size: 16px;
  margin: 8px 0;
  padding-right: 40px;
  font-weight: ${(props) => (props.className === 'selected' ? 700 : 500)};
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
const MenuItemContent = styled.a`
  display: block;
  width: 210px;
  text-decoration: none;
  color: ${(props: any) =>
    props.className === 'selected'
      ? 'rgba(0, 0, 0, 0.84)'
      : 'rgba(0, 0, 0, 0.54)'};
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
`;

/* tslint:disable-next-line */
const MenuItemIcon = styled.img`
  width: 22px;
  margin: 3px 16px 3px 0;
`;

export default class StepList extends React.Component<
  StepListProps,
  StepListState
> {
  constructor(props: StepListProps) {
    super(props);

    const { commits } = this.props;
    this.state = {
      nowSelected: handleAnchor(commits[0].name),
      itemTopOffsets: [],
    };
  }

  updateSelect = (anchor: string) => {
    this.setState({ nowSelected: anchor });
  };

  handleScroll = () => {
    const { itemTopOffsets } = this.state;
    const item = itemTopOffsets.find((itemTopOffset, i) => {
      const nextItemTopOffset = itemTopOffsets[i + 1];
      if (nextItemTopOffset) {
        return (
          window.scrollY >= itemTopOffset.offsetTop &&
          window.scrollY < nextItemTopOffset.offsetTop
        );
      }
      return window.scrollY >= itemTopOffset.offsetTop;
    });
    this.setState({
      nowSelected: item ? item.id : '',
    });
  };

  componentDidMount() {
    const { commits } = this.props;
    if (isClientOrServer()) {
      this.setState({
        itemTopOffsets: commits.map((commit) =>
          document.getElementById(handleAnchor(commit.name)),
        ),
      });
    }
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const { commits } = this.props;

    return (
      <TutureSteps>
        <MenuHeader>
          <MenuHeaderText>教程目录</MenuHeaderText>
        </MenuHeader>
        <TutureMenu>
          {commits.map((item, key) => (
            <TutureMenuItem
              key={key}
              className={
                this.state.nowSelected === handleAnchor(item.name)
                  ? 'selected'
                  : ''
              }>
              <MenuItemContent
                className={
                  this.state.nowSelected === handleAnchor(item.name)
                    ? 'selected'
                    : ''
                }
                href={`#${handleAnchor(item.name)}`}
                onClick={() => this.updateSelect(handleAnchor(item.name))}>
                {item.name}
              </MenuItemContent>
            </TutureMenuItem>
          ))}
        </TutureMenu>
      </TutureSteps>
    );
  }
}

export { TutureSteps, TutureMenu, TutureMenuItem };
