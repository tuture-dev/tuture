import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { inject, observer } from 'mobx-react';

import { Step, Tuture } from '../../../types';
import { TutureMenu, MenuHeaderText } from './StepList';
import { reorder, handleAnchor, rem } from '../utils';
import Icon from './Icon';
import Store from '../store';

export interface SideBarRightProps {
  store?: Store;
}

const SideBarRightWrapper = styled.div`
  min-width: 200px;
  width: 200px;
  background-color: white;
  height: 637px;
  margin-top: 32px;
  position: fixed;
  right: 0;
  transition: opacity 0.5s;
  background-color: transparent;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const SideBarRightMenuHeaderText = MenuHeaderText.extend`
  margin-bottom: 16px;
`;

const MenuItemText = styled.p`
  width: 180px;
  padding: 0 30px 0 20px;
  box-sizing: border-box;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
`;

const IconHelper = styled.div`
  position: absolute;
  right: 16px;
  bottom: 8px;
  display: flex;
  align-items: center;
  width: 20px;
  justify-content: space-between;
`;

injectGlobal`
  .menu-item:hover .icon-eye {
    fill: #000
  }
`;

const getItemStyle = (
  isDragging: any,
  draggableStyle: any,
  display?: boolean,
  isEditMode?: boolean,
) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  background: '#ffffff',
  boxShadow: isDragging
    ? '0 1px 10px 0 rgba(0, 0, 0, .1)'
    : '0 1px 1px 0 rgba(0, 0, 0, 0.1)',
  borderRadius: '4px',
  margin: '0px 16px 16px 16px',
  fontFamily: 'Georgia, "Times New Roman", Times, serif',
  fontSize: '16px',
  padding: '8px 16px 8px 8px',
  position: 'relative',
  cursor: isEditMode ? 'pointer' : 'auto',
  color: display ? 'rgba(0, 0, 0, .84)' : 'rgba(0, 0, 0, .24)',
  // styles we need to apply on draggables
  ...draggableStyle,
});

@inject('store')
@observer
export default class SideBarRight extends React.Component<SideBarRightProps> {
  onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const { store } = this.props;
    const { tuture, nowSelected } = store;
    const nowStepIndex = this.getNowStepIndex(tuture, nowSelected);
    const nowStepDiff = this.getNowStepDiff();

    tuture.steps[nowStepIndex].diff = reorder(
      nowStepDiff,
      result.source.index,
      result.destination.index,
    );
    store.tuture = tuture;
  };

  handleToggleDisplay = (i: number) => {
    const { store } = this.props;
    const { tuture, nowSelected } = store;
    const nowStepIndex = this.getNowStepIndex(tuture, nowSelected);
    let nowStepDiff = this.getNowStepDiff();

    nowStepDiff = nowStepDiff
      .slice(0, i)
      .concat({ ...nowStepDiff[i], display: !nowStepDiff[i].display })
      .concat(nowStepDiff.slice(i + 1));
    store.tuture.steps[nowStepIndex].diff = nowStepDiff;
  };

  getNames = () => {
    const { store } = this.props;
    let nowStep: Step;
    store.tuture.steps.map((step) => {
      if (handleAnchor(step.name) === store.nowSelected) {
        nowStep = step;
      }
    });
    const filenames = nowStep.diff.map((diffItem) => diffItem.file);
    const stepName = nowStep.name;
    return {
      filenames,
      stepName,
    };
  };

  getNowStepIndex = (tuture: Tuture, nowSelected: string) => {
    let nowStepIndex = 0;
    tuture.steps.map((step, index) => {
      if (handleAnchor(step.name) === nowSelected) {
        nowStepIndex = index;
      }
    });
    return nowStepIndex;
  };

  getNowStepDiff = () => {
    const { store } = this.props;
    const { tuture, nowSelected } = store;
    const nowStepIndex = this.getNowStepIndex(tuture, nowSelected);
    const nowStepDiff = tuture.steps[nowStepIndex].diff;
    return nowStepDiff;
  };

  render() {
    const { store } = this.props;
    const { filenames, stepName } = this.getNames();
    const { tuture, nowSelected } = store;
    const nowStepIndex = this.getNowStepIndex(tuture, nowSelected);
    const nowStepDiff = tuture.steps[nowStepIndex].diff;

    return (
      <SideBarRightWrapper className={store.sidebarOpacityClass}>
        <SideBarRightMenuHeaderText>{stepName}</SideBarRightMenuHeaderText>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable" isDropDisabled={!store.isEditMode}>
            {(dropProvided) => (
              <TutureMenu innerRef={dropProvided.innerRef}>
                {filenames.map((filename, i) => (
                  <Draggable
                    key={`${filename}-${i}`}
                    isDragDisabled={!store.isEditMode}
                    draggableId={`${filename}-${i}`}
                    index={i}>
                    {(dropProvided, snapshot) => {
                      return (
                        <div
                          key={i}
                          className="menu-item"
                          ref={dropProvided.innerRef}
                          {...dropProvided.draggableProps}
                          {...dropProvided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            dropProvided.draggableProps.style,
                            nowStepDiff[i].display,
                            store.isEditMode,
                          )}>
                          {store.isEditMode && (
                            <Icon
                              name="icon-drag"
                              customStyle={{
                                width: '10px',
                                height: '6.67px',
                                display: 'block',
                              }}
                            />
                          )}
                          <MenuItemText>{filename}</MenuItemText>
                          {store.isEditMode && (
                            <IconHelper>
                              <Icon
                                name="icon-eye"
                                className="icon-eye"
                                onClick={() => this.handleToggleDisplay(i)}
                                customStyle={{
                                  width: '20px',
                                  height: '13px',
                                  unHoveredFill: nowStepDiff[i].display
                                    ? 'rgba(0, 0, 0, 0)'
                                    : 'rgba(0, 0, 0, .24)',
                                }}
                              />
                            </IconHelper>
                          )}
                        </div>
                      );
                    }}
                  </Draggable>
                ))}
                {dropProvided.placeholder}
              </TutureMenu>
            )}
          </Droppable>
        </DragDropContext>
      </SideBarRightWrapper>
    );
  }
}
