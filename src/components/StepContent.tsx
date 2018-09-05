import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import { DiffItem } from './DiffView';
import ExplainedItem from './ExplainedItem';
import StepDiff from './StepDiff';
import {
  HasExplainWrapper,
  HasExplainButton,
  EditorWrapper,
} from './Markdown/index';
import { SaveButton, UndoButton } from './Markdown/common';
import Store from './store';

import { Step } from '../types';
import { handleAnchor, rem } from '../utils/common';

interface StepContentProps {
  content: Step;
  diffItem: DiffItem | string;
  index: number;
  store?: Store;
}

interface StepContentState {
  isEditing?: boolean;
  name?: string;
  disable?: boolean;
}

const TutureWrapper = styled.div`
  min-width: 605px;
  width: ${rem(880)}rem;
  margin-left: ${rem(288)}rem;

  @media (max-width: 1406px) {
    margin-left: ${rem(340)}rem;
  }

  @media (max-width: 1200px) {
    margin-left: ${rem(200)}rem;
  }

  @media (max-width: 1024px) {
    margin-left: ${rem(120)}rem;
  }
`;

const TutureContentHeader = styled.h1`
  font-family: LucidaGrande-Bold;
  font-size: 37px;
  color: rgba(0, 0, 0, 0.84);
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 44px;
  margin-bottom: 0;
`;

@inject('store')
@observer
export default class StepContent extends React.Component<
  StepContentProps,
  StepContentState
> {
  constructor(props: StepContentProps) {
    super(props);

    this.state = {
      isEditing: false,
      disable: false,
      name: props.content.name,
    };
  }

  handleEditHeader = () => {
    this.setState({
      isEditing: true,
    });
  };

  handleDeleteHeader = () => {};

  handleSave = () => {
    const { store, content } = this.props;
    if (!this.state.name) {
      this.setState({
        disable: true,
      });
      return;
    }
    store.updateStepName(content.commit, this.state.name);
    this.setState({
      isEditing: false,
    });
  };

  handleUndo = () => {
    const { name } = this.props.content;
    this.setState({
      name,
      isEditing: false,
    });
  };

  updateName = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    this.setState({
      name: value,
      disable: value ? false : true,
    });
  };

  render() {
    const { content, diffItem, index, store } = this.props;
    const { explain, diff, commit } = content;
    const { disable } = this.state;

    return (
      <TutureWrapper id={handleAnchor(this.state.name)}>
        {store.isEditMode ? (
          this.state.isEditing ? (
            [
              <input
                type="text"
                key="input"
                maxLength={40}
                value={this.state.name}
                style={disable ? { borderColor: 'red' } : {}}
                onChange={this.updateName}
              />,
              <div
                key="saveButton"
                style={{
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  marginTop: 12,
                }}>
                <SaveButton
                  disabled={disable}
                  onClick={() => this.handleSave()}
                  style={disable ? { backgroundColor: '#999' } : {}}>
                  确定
                </SaveButton>
                <UndoButton onClick={() => this.handleUndo()}>取消</UndoButton>
              </div>,
            ]
          ) : (
            <EditorWrapper>
              <TutureContentHeader>{this.state.name}</TutureContentHeader>
              <HasExplainWrapper>
                <HasExplainButton
                  color="#00B887"
                  border="1px solid #00B887"
                  bColor="#fff"
                  onClick={() => this.handleEditHeader()}>
                  编辑
                </HasExplainButton>
              </HasExplainWrapper>
            </EditorWrapper>
          )
        ) : (
          <TutureContentHeader>{this.state.name}</TutureContentHeader>
        )}
        <ExplainedItem
          explain={explain}
          isRoot={true}
          commit={commit}
          diffKey="root">
          <StepDiff
            diff={diff}
            index={index}
            diffItem={diffItem}
            commit={commit}
          />
        </ExplainedItem>
      </TutureWrapper>
    );
  }
}
