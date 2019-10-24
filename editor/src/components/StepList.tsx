import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { translate } from 'react-i18next';

import { handleAnchor, isClientOrServer, rem } from '../utils';
import Store from '../store';
import { Commit } from '../../../types';

export interface StepListProps {
  commits: Commit[];
  store?: Store;
  t?: any;
}
export interface StepListState {
  itemTopOffsets: HTMLElement[];
}

/* tslint:disable-next-line */
const TutureSteps = styled.div`
  width: 100%;
  height: 637px;
  text-align: left;
`;

export const MenuHeader = styled.div`
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  display: flex;
  padding-left: 41px;
  align-items: center;
`;

export const MenuHeaderText = styled.p`
  font-family: Roboto;
  font-size: 30px;
  color: rgba(0, 0, 0, 0.84);
  margin-bottom: -10px;
  padding-right: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.54);
  width: 180px;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
`;

export const TutureMenu = styled.ul`
  height: 503px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 14px;
  margin: 0;
  padding: 0;
  margin-top: 10px;
  outline: none;
  list-style: none;
  color: rgba(0, 0, 0, 0.84);
`;

/* tslint:disable-next-line */
const TutureMenuItem = styled.li`
  width: ${(props) =>
    props.className === 'selected' ? 'calc(100% -38px)' : 'calc(100% -41px)'};
  font-family: Roboto;
  font-size: 16px;
  margin: 8px 0;
  padding-right: 40px;
  font-weight: ${(props) => (props.className === 'selected' ? 700 : 400)};
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
  width: ${rem(210)}rem;
  text-decoration: none;
  color: ${(props: any) =>
    props.className === 'selected'
      ? 'rgba(0, 0, 0, 0.84)'
      : 'rgba(0, 0, 0, 0.54)'};
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
`;

@inject('store')
@observer
class StepList extends React.Component<StepListProps, StepListState> {
  constructor(props: StepListProps) {
    super(props);

    this.state = {
      itemTopOffsets: [],
    };
  }

  updateSelect = (anchor: string) => {
    const { store } = this.props;
    store.nowSelected = anchor;
    store.isStepListClick = true;
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
    const nowSelected = item ? item.id : '';
    const { store } = this.props;

    if (store.isStepListClick) {
      store.isStepListClick = false;
      return;
    }
    store.nowSelected = nowSelected ? nowSelected : store.nowSelected;
  };

  componentDidMount() {
    const { commits } = this.props;
    if (isClientOrServer() === 'client') {
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
    const { commits, store, t } = this.props;

    return (
      <TutureSteps>
        <MenuHeader>
          <MenuHeaderText>{t('menu')}</MenuHeaderText>
        </MenuHeader>
        <TutureMenu>
          {commits.map((item, key) => (
            <TutureMenuItem
              key={key}
              className={
                store.nowSelected === handleAnchor(item.name) ? 'selected' : ''
              }>
              <MenuItemContent
                className={
                  store.nowSelected === handleAnchor(item.name)
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

export default translate('translations')(StepList);
export { TutureSteps, TutureMenuItem };
