import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import { rem } from '../utils/common';
import Store from './store';
import {
  HasExplainWrapper,
  HasExplainButton,
  EditorWrapper,
  AddExplainWrapper,
} from './Markdown/index';
import { SaveButton, UndoButton } from './Markdown/common';
import Icon from './common/Icon';

export interface BriefProps {
  store?: Store;
  title?: string;
  description?: string;
  techTag?: string[];
}

interface BriefState {
  title?: string;
  description?: string;
  isTitleEditing?: boolean;
  isDescriptionEditing?: boolean;
  [index: string]: string | boolean;
}

const BriefWrapper = styled.div`
  min-width: 605px;
  width: ${rem(880)}rem;
  margin-left: ${rem(288)}rem;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;

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

const BriefContent = styled.div`
  width: 100%;
`;

const BriefTitle = styled.h1`
  font-family: STSongti-SC-Bold;
  color: rgba(0, 0, 0, 0.84);
  font-size: 45px;
`;

const BriefDescription = styled.p`
  width: 100%;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
  font-size: ${rem(23)}rem;
  box-sizing: border-box;
  padding: 20px 0;
  color: rgba(0, 0, 0, 0.54);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`;

const TechTag = styled.div`
  display: flex;
  flex-direction: column;
  p {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.54);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

const TechTagList = styled.div`
  span {
    font-size: 15px;
    border-radius: 3px;
    border: 1px solid #f0f0f0;
    color: rgba(0, 0, 0, 0.68);
    background-color: rgba(0, 0, 0, 0.05);
    font-weight: 400;
    padding: 10px;
    margin-right: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

@inject('store')
@observer
export default class Brief extends React.Component<BriefProps, BriefState> {
  private contentRef: React.RefObject<any>;
  constructor(props: BriefProps) {
    super(props);
    this.contentRef = React.createRef();

    const { title, description } = props;
    this.state = {
      title,
      description,
      isTitleEditing: false,
      isDescriptionEditing: false,
    };
  }

  handleBriefScroll = () => {
    const { store } = this.props;
    window.scrollY >= this.contentRef.current.clientHeight
      ? store.toggleShowSideBar(true)
      : store.toggleShowSideBar(false);
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleBriefScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleBriefScroll);
  }

  handleChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    if (name === 'title') {
      this.setState({
        title: value,
      });
    } else {
      this.setState({
        description: value,
      });
    }
  };

  handleSave = (elemName: string) => {
    const { store } = this.props;
    if (elemName === 'title' && !this.state[elemName]) {
      return;
    }
    if (elemName === 'title') {
      store.tuture.name = this.state.title;
      this.setState({
        isTitleEditing: false,
      });
    } else {
      store.tuture.description = this.state.description;
      this.setState({
        isDescriptionEditing: false,
      });
    }
    store.saveTuture();
  };

  handleEdit = (elemName: string) => {
    if (elemName === 'title') {
      this.setState({
        isTitleEditing: true,
      });
    } else {
      this.setState({
        isDescriptionEditing: true,
      });
    }
  };

  handleDelete = () => {
    const { store } = this.props;
    this.setState({ description: '' });
    store.tuture.description = '';
    store.saveTuture();
  };

  handleUndo = (elemName: string) => {
    if (elemName === 'title') {
      this.setState({
        isTitleEditing: false,
        title: this.props.title,
      });
    } else {
      this.setState({
        isDescriptionEditing: false,
        description: this.props.description,
      });
    }
  };

  renderEditFunction = (
    elemState: boolean,
    elemName: string,
    elemValue: string,
    elemDisabled: boolean,
    ElemNode: React.ReactNode,
  ) => {
    const { store } = this.props;
    return store.isEditMode ? (
      elemState ? (
        [
          <textarea
            name={elemName}
            key="input"
            maxLength={elemName === 'title' ? 40 : undefined}
            rows={elemName === 'title' ? 2 : 8}
            value={elemValue}
            style={
              elemName === 'title' && elemDisabled ? { borderColor: 'red' } : {}
            }
            onChange={this.handleChange}
          />,
          <div
            key="saveButton"
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              marginTop: 12,
              marginBottom: 16,
            }}>
            <SaveButton
              onClick={() => this.handleSave(elemName)}
              style={
                elemName === 'title' && elemDisabled
                  ? { backgroundColor: '#999' }
                  : {}
              }>
              确定
            </SaveButton>
            <UndoButton onClick={() => this.handleUndo(elemName)}>
              取消
            </UndoButton>
          </div>,
        ]
      ) : elemValue ? (
        <EditorWrapper>
          {ElemNode}
          <HasExplainWrapper>
            {elemName === 'description' && (
              <HasExplainButton
                color="#cb2431"
                border="1px solid #cb2431"
                bColor="#fff"
                onClick={() => this.handleDelete()}>
                删除
              </HasExplainButton>
            )}
            <HasExplainButton
              color="#00B887"
              border="1px solid #00B887"
              bColor="#fff"
              onClick={() => this.handleEdit(elemName)}>
              编辑
            </HasExplainButton>
          </HasExplainWrapper>
        </EditorWrapper>
      ) : (
        <AddExplainWrapper onClick={() => this.handleEdit(elemName)}>
          <Icon
            name="icon-write"
            customStyle={{ width: '17.39px', height: '17.84px' }}
          />
          <span style={{ padding: '10px' }}>添加此教程的简介</span>
        </AddExplainWrapper>
      )
    ) : (
      ElemNode
    );
  };

  render() {
    const { techTag } = this.props;
    return (
      <BriefWrapper innerRef={this.contentRef}>
        <BriefContent>
          {this.renderEditFunction(
            this.state.isTitleEditing,
            'title',
            this.state.title,
            this.state.title === '',
            <BriefTitle>{this.props.title}</BriefTitle>,
          )}
          {this.renderEditFunction(
            this.state.isDescriptionEditing,
            'description',
            this.state.description,
            this.state.description === '',
            <BriefDescription>{this.props.description}</BriefDescription>,
          )}
        </BriefContent>
        <TechTag>
          <p>本篇教程涉及的内容：</p>
          <TechTagList>
            {techTag.map((item: string) => (
              <span key={`${item}-${Math.random() * 10}`}>{item}</span>
            ))}
          </TechTagList>
        </TechTag>
      </BriefWrapper>
    );
  }
}
