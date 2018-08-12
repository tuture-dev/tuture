import React from 'react';
import classnames from 'classnames';
import fetch from 'isomorphic-fetch';

// @ts-ignore
import Upload from 'rc-upload';

import Viewer from './Viewer';
import { ExplainType, EditMode } from '../../types/ExplainedItem';
import {
  TabWrapper,
  Button,
  SaveButton,
  HasExplainWrapper,
  EditExplainWrapper,
  HasExplainButton,
  AddExplainWrapper,
  ToolButton,
  WriteImage,
} from './Editor.style';
import Toolbar from './Toolbar';
import { insertStr } from './utils';
import EditIcon from '../write.png';

export interface EditorProps {
  source: string;
  type: ExplainType;
  classnames?: string;
  isRoot?: boolean;
  isEditMode?: boolean;
  handleSave?: (explainType: ExplainType, explain: string) => void;
}

export interface EditorState {
  nowTab: EditMode;
  isEditing?: boolean;
  source?: string;
  editFrameHeight?: number;
}

export default class Editor extends React.Component<EditorProps, EditorState> {
  private contentRef: React.RefObject<HTMLTextAreaElement>;
  private cursorPos: number = -1;

  constructor(props: EditorProps) {
    super(props);

    const { source } = this.props;
    this.state = {
      source,
      nowTab: 'edit',
      isEditing: false,
      editFrameHeight: 200,
    };
    this.contentRef = React.createRef();
  }

  componentWillReceiveProps(nextProps: EditorProps) {
    if (nextProps.isEditMode !== this.props.isEditMode) {
      this.setState({
        isEditing: false,
      });
    }
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

  handleSave = (type: ExplainType) => {
    this.setState({
      isEditing: false,
    });

    this.props.handleSave(type, this.state.source);
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
        const currentExplain = that.state.source as string;
        const explainTextarea = this.contentRef.current;
        const newCurrentExplain = insertStr(
          currentExplain,
          `![](${savePath})`,
          explainTextarea.selectionStart,
        );

        this.changePosition(
          currentExplain.slice(0, explainTextarea.selectionStart).length + 2,
        );
        this.setState({ source: newCurrentExplain });

        this.props.handleSave(name, newCurrentExplain);
      });
  }

  handleChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const { value, scrollHeight } = e.currentTarget;
    let needRenderScrollHeight = scrollHeight;
    if (needRenderScrollHeight <= 200) {
      needRenderScrollHeight = 200;
    } else if (needRenderScrollHeight >= 400) {
      needRenderScrollHeight = 400;
    }
    this.setState({
      source: value,
      editFrameHeight: needRenderScrollHeight,
    });
  };

  handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    this.handleImageUpload(e, 'paste');
  };

  handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    this.handleImageUpload(e, 'drop');
  };

  handleDelete = () => {
    const { type } = this.props;
    this.setState({ source: '' });
    this.props.handleSave(type, '');
  };

  handleAddExplain = () => {
    this.setState({
      isEditing: true,
    });
  };

  changePosition = (position: number) => {
    this.cursorPos = position;
  };

  changeState = (source: string) => {
    this.setState({ source });
  };

  renderTabWrapper = (type: ExplainType) => {
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
        <SaveButton onClick={() => this.handleSave(type)}>确定</SaveButton>
      </TabWrapper>
    );
  };

  rendorEditor = (): React.ReactNode => {
    const { isRoot, type } = this.props;
    const { nowTab, isEditing } = this.state;

    return (
      <div className={classnames('editor', { isRoot })}>
        {this.renderTabWrapper(type)}
        <Toolbar
          contentRef={this.contentRef}
          source={this.state.source}
          changePosition={this.changePosition}
          changeState={this.changeState}
          edit={isEditing}
          cursorPosition={this.cursorPos}
          handleCursor={this.handleCursor}>
          <Upload
            name="file"
            action={`http://${location.host}/upload`}
            accept=".jpg,.jpeg,.png,.gif"
            onSuccess={(body: { path: string }) => {
              const { source } = this.state;
              const textarea = this.contentRef.current;
              const updatedContent = insertStr(
                source,
                `![](${body.path})`,
                textarea.selectionStart,
              );

              this.changePosition(
                source.slice(0, textarea.selectionStart).length + 2,
              );
              this.setState({ source: updatedContent });

              this.props.handleSave(type, updatedContent);
            }}>
            <ToolButton>Img</ToolButton>
          </Upload>
        </Toolbar>
        {nowTab === 'edit' ? (
          <div>
            <textarea
              name={type}
              ref={this.contentRef}
              value={this.state.source}
              placeholder="写一点解释..."
              onChange={this.handleChange}
              onPaste={this.handlePaste}
              onDrop={this.handleDrop}
              style={{
                height: this.state.editFrameHeight as number,
                overflow: 'auto',
              }}
            />
          </div>
        ) : (
          <Viewer
            source={this.state.source}
            classnames={classnames('markdown', 'preview-markdown', {
              isRoot,
            })}
          />
        )}
      </div>
    );
  };

  renderHasExplainButton = () => {
    return (
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
    );
  };

  render() {
    const { isRoot } = this.props;

    return this.state.isEditing ? (
      this.rendorEditor()
    ) : (
      <EditExplainWrapper>
        <Viewer
          source={this.state.source}
          classnames={classnames('markdown', { isRoot })}
        />
        {this.state.source ? (
          this.renderHasExplainButton()
        ) : (
          <AddExplainWrapper onClick={() => this.handleAddExplain()}>
            <WriteImage src={EditIcon} alt="edit-icon" />
          </AddExplainWrapper>
        )}
      </EditExplainWrapper>
    );
  }
}
