import React from 'react';
import classnames from 'classnames';
import styled from 'styled-components';

import Viewer from './Viewer';
import Editor from './Editor';
import { BasicButton } from './common';
import { ExplainType } from '../../types/ExplainedItem';
import EditIcon from '../write.png';

const EditorWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const AddExplainWrapper = styled.div`
  display: block;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #00b887;
  color: #00b887;
  padding: 10px 10px 5px 10px;
  font-size: 20px;
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
  color: ${(props: { color: string; border: string }) => props.color};
  border: ${(props: { color: string; border: string }) => props.border};
  border-radius: 4px;
  margin-right: 30px;
`;

const WriteImage = styled.img`
  width: 20px;
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
}

export default class Markdown extends React.Component<
  MarkdownProps,
  MarkdownState
> {
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
    this.props.handleSave(type, '');
  };

  handleAddExplain = () => {
    this.updateEditingStatus(true);
  };

  handleSave = (content: string) => {
    this.props.handleSave(this.props.type, content);
  };

  render() {
    const { isEditMode, source, isRoot } = this.props;

    return isEditMode ? (
      this.state.isEditing ? (
        <Editor
          {...this.props}
          source={source}
          handleSave={this.handleSave}
          updateEditingStatus={this.updateEditingStatus}
        />
      ) : (
        <EditorWrapper>
          <Viewer
            source={source}
            classnames={classnames('markdown', { isRoot })}
          />
          {source ? (
            <HasExplainWrapper>
              <div>
                <HasExplainButton
                  color="rgba(0,0,0,0.84)"
                  border="1px solid rgba(0,0,0,0.84)"
                  onClick={() => this.handleAddExplain()}>
                  编辑
                </HasExplainButton>
                <HasExplainButton
                  color="#cb2431"
                  border="1px solid #cb2431"
                  onClick={() => this.handleDelete()}>
                  删除
                </HasExplainButton>
              </div>
            </HasExplainWrapper>
          ) : (
            <AddExplainWrapper onClick={() => this.handleAddExplain()}>
              <WriteImage src={EditIcon} alt="edit-icon" />
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
      <Viewer source={source} classnames={classnames('markdown', { isRoot })} />
    );
  }
}
