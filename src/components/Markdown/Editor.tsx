import React from 'react';
import classnames from 'classnames';
import fetch from 'isomorphic-fetch';

// @ts-ignore
import Upload from 'rc-upload';
import TextareaAutoresize from 'react-autosize-textarea';

import Viewer from './Viewer';
import { ExplainType, EditMode } from '../../types/ExplainedItem';
import {
  BasicButton,
  TabWrapper,
  SaveButton,
  ToolButton,
  UndoButton,
} from './common';
import Toolbar from './Toolbar';
import { insertStr } from './utils';
import Icon from '../common/Icon';
import { rem } from '../../utils/common';

interface EditorProps {
  source: string;
  type: ExplainType;
  isRoot?: boolean;
  classnames?: string;
  updateEditingStatus: (isEditing: boolean) => void;
  handleSave?: (content: string) => void;
  handleUndo?: () => void;
  updateContent?: (content: string) => void;
}

interface EditorState {
  nowTab: EditMode;
  editFrameHeight?: number;
  contentRef?: HTMLTextAreaElement;
}

const TabButton = BasicButton.extend`
  font-size: 14px;
  height: 39px;
  border: ${(props: { selected?: boolean; color?: string }) =>
    props.color
      ? `1px solid ${props.color}`
      : props.selected
        ? '1px solid #d1d5da;'
        : '1px solid transparent'};
  border-bottom: ${(props: { selected?: boolean; color?: string }) =>
    props.color ? `1px solid ${props.color}` : props.selected && '0'};
  color: ${(props: { selected?: boolean; color?: string }) =>
    props.color
      ? props.color
      : props.selected
        ? 'rgba(0,0,0,.84)'
        : 'rgba(0,0,0,.84)'};
  bottom: ${(props: { selected?: boolean; color?: string }) =>
    props.selected ? '-2px' : 0};
  padding: 0 ${rem(18)}rem;
`;

export default class Editor extends React.Component<EditorProps, EditorState> {
  private contentRef: HTMLTextAreaElement;
  private cursorPos: number = -1;

  constructor(props: EditorProps) {
    super(props);

    this.state = {
      nowTab: 'edit',
      editFrameHeight: 200,
      contentRef: this.contentRef,
    };
  }

  componentDidMount() {
    if (this.contentRef) {
      this.contentRef.focus();
      this.setState({
        contentRef: this.contentRef,
      });
    }
  }

  componentDidUpdate() {
    if (this.cursorPos !== -1) {
      const textarea = this.contentRef;
      if (textarea) {
        textarea.focus();
      }
      if (this.cursorPos && textarea) {
        textarea.setSelectionRange(this.cursorPos, this.cursorPos);
      }
      this.cursorPos = -1;
    }
  }

  updateContent = (content: string) => {
    this.props.updateContent(content);
  };

  handleCursor = (position?: number, textarea?: HTMLTextAreaElement) => {
    if (textarea) {
      textarea.focus();
    }
    if (position && textarea) {
      textarea.setSelectionRange(position, position);
    }
  };

  handleTabClick = (nowTab: EditMode) => {
    this.setState({ nowTab });
  };

  handleSave = () => {
    this.props.handleSave(this.props.source);
    this.props.updateEditingStatus(false);
  };
  handleUndo = () => {
    this.props.handleUndo();
    this.props.updateEditingStatus(false);
  };

  handleImageUpload(
    e: React.SyntheticEvent<HTMLTextAreaElement>,
    eventType: 'paste' | 'drop',
  ) {
    const files =
      eventType === 'paste'
        ? (e as React.ClipboardEvent<HTMLTextAreaElement>).clipboardData.files
        : (e as React.DragEvent<HTMLTextAreaElement>).dataTransfer.files;

    if (files.length === 0 || !/\.(png|jpe?g|bmp)$/.test(files[0].name)) {
      // Not a valid image.
      return;
    }

    // Prevent default behaviors of pasting and dropping events.
    e.preventDefault();

    // Upload the first images to server.
    const data = new FormData();
    const that = this;
    data.append('file', files[0]);

    fetch(`http://${location.host}/upload`, {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((resObj) => {
        const savePath = resObj.path;

        // Add markdown image element to current explain.
        const currentContent = that.props.source as string;
        const textarea = this.contentRef;
        const updatedContent = insertStr(
          currentContent,
          `![](${savePath})`,
          textarea.selectionStart,
        );

        this.changePosition(
          currentContent.slice(0, textarea.selectionStart).length + 2,
        );

        this.updateContent(updatedContent);
      });
  }

  handleChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const { value } = e.currentTarget;
    this.props.updateContent(value);
  };

  handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    this.handleImageUpload(e, 'paste');
  };

  handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    this.handleImageUpload(e, 'drop');
  };

  changePosition = (position: number) => {
    this.cursorPos = position;
  };

  renderTabWrapper = () => {
    const { nowTab } = this.state;
    return (
      <TabWrapper>
        <div>
          <TabButton
            name="edit"
            onClick={() => this.handleTabClick('edit')}
            selected={nowTab === 'edit'}>
            编写
          </TabButton>
          <TabButton
            name="preview"
            onClick={() => this.handleTabClick('preview')}
            selected={nowTab === 'preview'}>
            预览
          </TabButton>
        </div>
        {nowTab === 'edit' ? (
          <Toolbar
            contentRef={this.contentRef}
            source={this.props.source || ''}
            changePosition={this.changePosition}
            updateContent={this.updateContent}
            cursorPosition={this.cursorPos}
            handleCursor={this.handleCursor}>
            <Upload
              name="file"
              action={`http://${location.host}/upload`}
              accept=".jpg,.jpeg,.png,.gif"
              onSuccess={(body: { path: string }) => {
                const { source } = this.props;
                const textarea = this.contentRef;
                const updatedContent = insertStr(
                  source,
                  `![](${body.path})`,
                  textarea.selectionStart,
                );

                this.changePosition(
                  source.slice(0, textarea.selectionStart).length + 2,
                );
                this.updateContent(updatedContent);
              }}>
              <ToolButton>
                <Icon
                  name="icon-image"
                  customStyle={{
                    width: '19px',
                    height: '17px',
                    fill: '#00b887',
                  }}
                />
              </ToolButton>
            </Upload>
          </Toolbar>
        ) : null}
      </TabWrapper>
    );
  };

  render() {
    const { isRoot, type } = this.props;
    const { nowTab } = this.state;

    return (
      <div className={classnames('editor')}>
        {this.renderTabWrapper()}
        {nowTab === 'edit' ? (
          <div>
            <TextareaAutoresize
              name={type}
              rows={8}
              maxRows={15}
              innerRef={(ref) => (this.contentRef = ref)}
              value={this.props.source}
              placeholder="写一点解释..."
              onChange={this.handleChange}
              onPaste={this.handlePaste}
              onDrop={this.handleDrop}
            />
          </div>
        ) : (
          <div>
            <Viewer
              source={this.props.source}
              classnames={classnames('markdown', 'preview-markdown', {
                isRoot,
              })}
            />
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            marginTop: 12,
          }}>
          <SaveButton onClick={() => this.handleSave()}>确定</SaveButton>
          <UndoButton onClick={() => this.handleUndo()}>取消</UndoButton>
        </div>
      </div>
    );
  }
}
