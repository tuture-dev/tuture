import React from 'react';
import classnames from 'classnames';
import styled from 'styled-components';

import Viewer from './Viewer';
import Editor from './Editor';
import { BasicButton } from './common';
import { ExplainType } from '../../types/ExplainedItem';
import Icon from '../common/Icon';

const EditorWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const AddExplainWrapper = styled.div`
  font-family: LucidaGrande;
  display: block;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #00b887;
  color: #00b887;
  padding: 10px;
  font-size: 14px;
  opacity: 0.3;
  border-radius: 3px;
  text-align: center;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;

const HasExplainWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  background-color: rgba(255, 255, 255, 0.7);
  &:hover {
    opacity: 1;
    transition: opacity 0.3s;
    border: 1px solid #00b887;
  }
`;

const HasExplainButton = styled(BasicButton)`
  color: ${(props: { color: string; border: string; bColor: string }) =>
    props.color};
  border: ${(props: { color: string; border: string; bColor: string }) =>
    props.border};
  background-color: ${(props: {
    color: string;
    border: string;
    bColor: string;
  }) => props.bColor};
  border-radius: 4px;
  margin-right: 30px;
`;
interface MarkdownProps {
  source: string;
  type: ExplainType;
  isRoot?: boolean;
  classnames?: string;
  isEditMode?: boolean;
  handleSave?: (explainType: ExplainType, explain: string) => void;
}

interface MarkdownState {
  isEditing: boolean;
  content: string;
}

export default class Markdown extends React.Component<
  MarkdownProps,
  MarkdownState
> {
  constructor(props: MarkdownProps) {
    super(props);

    this.state = {
      isEditing: false,
      content: this.props.source,
    };
  }
  componentWillReceiveProps(nextProps: MarkdownProps) {
    if (nextProps.isEditMode !== this.props.isEditMode) {
      this.setState({
        isEditing: false,
      });
    }
  }

  updateEditingStatus = (isEditing: boolean) => {
    this.setState({ isEditing });
  };

  handleDelete = () => {
    const { type } = this.props;
    this.setState({ content: '' });
    this.props.handleSave(type, '');
  };

  handleAddExplain = () => {
    this.updateEditingStatus(true);
  };

  handleSave = (content: string) => {
    this.props.handleSave(this.props.type, content);
  };
  handleUndo = () => {
    this.setState({ content: this.props.source });
  };

  updateContent = (content: string) => {
    this.setState({
      content,
    });
  };

  render() {
    const { isEditMode, source, isRoot } = this.props;
    const { content } = this.state;

    return isEditMode ? (
      this.state.isEditing ? (
        <Editor
          {...this.props}
          source={content}
          handleSave={this.handleSave}
          handleUndo={this.handleUndo}
          updateContent={this.updateContent}
          updateEditingStatus={this.updateEditingStatus}
        />
      ) : (
        <EditorWrapper>
          <Viewer
            source={content}
            classnames={classnames('markdown', { isRoot })}
          />
          {content ? (
            <HasExplainWrapper>
              <div>
                <HasExplainButton
                  color="white"
                  border="1px solid #00B887"
                  bColor="#00B887"
                  onClick={() => this.handleAddExplain()}>
                  编辑
                </HasExplainButton>
                <HasExplainButton
                  color="#cb2431"
                  border="1px solid #cb2431"
                  bColor="#fff"
                  onClick={() => this.handleDelete()}>
                  删除
                </HasExplainButton>
              </div>
            </HasExplainWrapper>
          ) : (
            <AddExplainWrapper onClick={() => this.handleAddExplain()}>
              <Icon name="icon-write" style={{ width: 17.39, height: 17.84 }} />
              <span style={{ padding: '10px' }}>
                {this.props.isRoot
                  ? this.props.type === 'pre'
                    ? '填写此步骤的介绍文字'
                    : '填写此步骤的总结文字'
                  : this.props.type === 'pre'
                    ? '填写修改此文件的介绍文字'
                    : '填写修改此文件的解释文字'}
              </span>
            </AddExplainWrapper>
          )}
        </EditorWrapper>
      )
    ) : (
      <Viewer
        source={content}
        classnames={classnames('markdown', { isRoot })}
      />
    );
  }
}
