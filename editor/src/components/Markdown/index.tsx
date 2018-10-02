import React from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { translate } from 'react-i18next';

import Viewer from './Viewer';
import Editor from './Editor';
import { BasicButton } from './common';
import Icon from '../Icon';
import { MarkdownStore } from '../ExplainedItem';
import { ExplainType } from '../../types';

export const EditorWrapper = styled.div`
  width: 100%;
  position: relative;
`;

export const AddExplainWrapper = styled.div`
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

export const HasExplainWrapper = styled.div`
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

const ContentHasExplainWrapper = HasExplainWrapper.extend`
  padding: 8px 0;
`;

export const HasExplainButton = styled(BasicButton)`
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
  markdown?: MarkdownStore;
  t?: any;
}

interface MarkdownState {
  isEditing: boolean;
  content: string;
}

@inject('markdown')
@observer
class Markdown extends React.Component<MarkdownProps, MarkdownState> {
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

    if (nextProps.source !== this.props.source) {
      this.setState({
        content: nextProps.source,
      });
    }
  }

  updateEditingStatus = (isEditing: boolean) => {
    this.setState({ isEditing });
  };

  handleDelete = () => {
    const { type, markdown } = this.props;
    this.setState({ content: '' });
    markdown.handleSave(type, '');
  };

  handleAddExplain = () => {
    this.updateEditingStatus(true);
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
    const { isEditMode, t, isRoot } = this.props;
    const { content } = this.state;

    return isEditMode ? (
      this.state.isEditing ? (
        <Editor
          {...this.props}
          source={content}
          handleUndo={this.handleUndo}
          updateContent={this.updateContent}
          updateEditingStatus={this.updateEditingStatus}
        />
      ) : (
        <EditorWrapper>
          <Viewer
            source={content}
            classnames={classnames('markdown', {
              isRoot,
            })}
          />
          {content ? (
            <ContentHasExplainWrapper>
              <div>
                <HasExplainButton
                  color="#00B887"
                  border="1px solid #00B887"
                  bColor="#fff"
                  onClick={() => this.handleAddExplain()}>
                  {t('editButton')}
                </HasExplainButton>
                <HasExplainButton
                  color="#cb2431"
                  border="1px solid #cb2431"
                  bColor="#fff"
                  onClick={() => this.handleDelete()}>
                  {t('deleteButton')}
                </HasExplainButton>
              </div>
            </ContentHasExplainWrapper>
          ) : (
            <AddExplainWrapper onClick={() => this.handleAddExplain()}>
              <Icon
                name="icon-write"
                customStyle={{ width: '17.39px', height: '17.84px' }}
              />
              <span style={{ padding: '10px' }}>
                {this.props.isRoot
                  ? this.props.type === 'pre'
                    ? t('fillStepIntroduction')
                    : t('fillStepExplain')
                  : this.props.type === 'pre'
                    ? t('fillFileIntrodution')
                    : t('fillFileExplain')}
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

export default translate('translations')(Markdown);
