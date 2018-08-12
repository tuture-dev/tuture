import React from 'react';
import classnames from 'classnames';
import fetch from 'isomorphic-fetch';

// @ts-ignore
import Upload from 'rc-upload';

import Viewer from './Viewer';
import { ExplainType, EditMode } from '../../types/ExplainedItem';
import { TabWrapper, Button, SaveButton, ToolButton } from './common';
import Toolbar from './Toolbar';
import { insertStr } from './utils';

interface EditorProps {
  source: string;
  type: ExplainType;
  isRoot?: boolean;
  classnames?: string;
  updateEditingStatus: (isEditing: boolean) => void;
  handleSave?: (content: string) => void;
}

interface EditorState {
  content: string;
  nowTab: EditMode;
  editFrameHeight?: number;
}

export default class Editor extends React.Component<EditorProps, EditorState> {
  private contentRef: React.RefObject<HTMLTextAreaElement>;
  private cursorPos: number = -1;

  constructor(props: EditorProps) {
    super(props);

    this.state = {
      content: this.props.source,
      nowTab: 'edit',
      editFrameHeight: 200,
    };
    this.contentRef = React.createRef();
  }

  componentDidUpdate() {
    if (this.cursorPos !== -1) {
      const textarea = this.contentRef.current;
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
    this.setState({ content });
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
    this.props.handleSave(this.state.content);
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
        const currentContent = that.state.content as string;
        const textarea = this.contentRef.current;
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
    this.setState({
      content: value,
    });
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
          <Button
            name="edit"
            onClick={() => this.handleTabClick('edit')}
            selected={nowTab === 'edit'}>
            编写
          </Button>
          <Button
            name="preview"
            onClick={() => this.handleTabClick('preview')}
            selected={nowTab === 'preview'}>
            预览
          </Button>
        </div>
        <SaveButton onClick={() => this.handleSave()}>确定</SaveButton>
      </TabWrapper>
    );
  };

  render() {
    const { isRoot, type } = this.props;
    const { nowTab } = this.state;

    return (
      <div className={classnames('editor')}>
        {this.renderTabWrapper()}
        <Toolbar
          contentRef={this.contentRef}
          source={this.state.content}
          changePosition={this.changePosition}
          updateContent={this.updateContent}
          cursorPosition={this.cursorPos}
          handleCursor={this.handleCursor}>
          <Upload
            name="file"
            action={`http://${location.host}/upload`}
            accept=".jpg,.jpeg,.png,.gif"
            onSuccess={(body: { path: string }) => {
              const { content } = this.state;
              const textarea = this.contentRef.current;
              const updatedContent = insertStr(
                content,
                `![](${body.path})`,
                textarea.selectionStart,
              );

              this.changePosition(
                content.slice(0, textarea.selectionStart).length + 2,
              );
              this.updateContent(updatedContent);
              this.handleSave();
            }}>
            <ToolButton>Img</ToolButton>
          </Upload>
        </Toolbar>
        {nowTab === 'edit' ? (
          <div>
            <textarea
              name={type}
              ref={this.contentRef}
              value={this.state.content}
              placeholder="写一点解释..."
              onChange={this.handleChange}
              onPaste={this.handlePaste}
              onDrop={this.handleDrop}
              style={{
                height: '200px',
                maxHeight: '400px',
                overflow: 'auto',
                resize: 'vertical',
              }}
            />
          </div>
        ) : (
          <Viewer
            source={this.state.content}
            classnames={classnames('markdown', 'preview-markdown', {
              isRoot,
            })}
          />
        )}
      </div>
    );
  }
}
