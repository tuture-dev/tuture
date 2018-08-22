import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { SideBarLeftWrapper } from './SideBarLeft';
import { TutureMenu, MenuHeader, MenuHeaderText } from './StepList';
import { reorder, handleAnchor, rem } from '../utils/common';
import Icon from './common/Icon';
import { Step, Tuture } from '../types/';

export interface SideBarRightProps {
  nowSelected: string;
  tuture: Tuture;
  isEditMode: boolean;
  updateTuture: (tuture: Tuture) => void;
}

export interface SideBarRightState {
  filenames: string[];
  stepName: string;
}

const SideBarRightWrapper = SideBarLeftWrapper.extend`
  width: 200px;
  background-color: white;
  height: 637px;
  margin-top: 32px;
  position: fixed;
  right: ${rem(100)}rem;
  background-color: transparent;
`;

const SideBarRightMenuHeader = MenuHeader.extend`
  padding-left: 16px;
  margin-bottom: 16px;
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
  .menu-item: hover .icon-eye {
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

export default class SideBarRight extends React.Component<
  SideBarRightProps,
  SideBarRightState
> {
  constructor(props: SideBarRightProps) {
    super(props);
    const { tuture, nowSelected } = props;

    this.state = {
      ...this.getNames(tuture, nowSelected),
    };
  }

  getNames = (tuture: Tuture, nowSelected: string) => {
    let nowStep: Step;
    tuture.steps.map((step) => {
      if (handleAnchor(step.name) === nowSelected) {
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

  componentWillReceiveProps(nextProps: SideBarRightProps) {
    if (nextProps.nowSelected !== this.props.nowSelected) {
      const { nowSelected, tuture } = nextProps;
      this.setState({
        ...this.getNames(tuture, nowSelected),
      });
    }
  }

  getNowStepIndex = (tuture: Tuture, nowSelected: string) => {
    let nowStepIndex = 0;
    tuture.steps.map((step, index) => {
      if (handleAnchor(step.name) === nowSelected) {
        nowStepIndex = index;
      }
    });
    return nowStepIndex;
  };

  onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const filenames = reorder(
      this.state.filenames,
      result.source.index,
      result.destination.index,
    );
    this.setState({ filenames });

    const { nowSelected, tuture } = this.props;
    const { nowStepDiff, nowStepIndex } = this.getNowStepDiff(
      tuture,
      nowSelected,
    );
    tuture.steps[nowStepIndex].diff = reorder(
      nowStepDiff,
      result.source.index,
      result.destination.index,
    );
    this.props.updateTuture(tuture);
  };

  getNowStepDiff = (tuture: Tuture, nowSelected: string) => {
    const nowStepIndex = this.getNowStepIndex(tuture, nowSelected);
    const nowStepDiff = tuture.steps[nowStepIndex].diff;
    return {
      nowStepIndex,
      nowStepDiff,
    };
  };

  handleToggleDisplay = (i: number) => {
    const { tuture, nowSelected } = this.props;
    const { nowStepDiff, nowStepIndex } = this.getNowStepDiff(
      tuture,
      nowSelected,
    );
    nowStepDiff[i].display = !nowStepDiff[i].display;
    tuture.steps[nowStepIndex].diff = nowStepDiff;
    this.props.updateTuture(tuture);
  };

  render() {
    const { filenames, stepName } = this.state;
    const { isEditMode, tuture, nowSelected } = this.props;
    const { nowStepDiff } = this.getNowStepDiff(tuture, nowSelected);

    return (
      <SideBarRightWrapper>
        <SideBarRightMenuHeader>
          <SideBarRightMenuHeaderText>{stepName}</SideBarRightMenuHeaderText>
        </SideBarRightMenuHeader>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable" isDropDisabled={!isEditMode}>
            {(dropProvided) => (
              <TutureMenu innerRef={dropProvided.innerRef}>
                {filenames.map((filename, i) => (
                  <Draggable
                    key={`${filename}-${i}`}
                    isDragDisabled={!isEditMode}
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
                            isEditMode,
                          )}>
                          {isEditMode && (
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
                          {isEditMode && (
                            <IconHelper>
                              <Icon
                                name="icon-eye"
                                className="icon-eye"
                                onClick={() => this.handleToggleDisplay(i)}
                                customStyle={{
                                  width: '20px',
                                  height: '13px',
                                  unHoveredFill: nowStepDiff[i].display
                                    ? '#FFF'
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
