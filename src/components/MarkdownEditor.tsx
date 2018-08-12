import React from 'react';
import classnames from 'classnames';
import fetch from 'isomorphic-fetch';

// @ts-ignore
import Markdown from 'react-markdown';

// @ts-ignore
import Upload from 'rc-upload';

import { ExplainType, EditMode, ToolType } from '../types/ExplainedItem';
import {
  TabWrapper,
  Button,
  SaveButton,
  HasExplainWrapper,
  EditExplainWrapper,
  HasExplainButton,
  NoExplainWrapper,
  ToolButton,
} from './MarkdownEditor.style';
import MarkdownTool from './MarkdownTool';
import { spliceStr, insertStr } from '../utils/common';
import EditIcon from './write.png';

export interface MarkdownEditorProps {
  source: string;
  type: ExplainType;
  classnames?: string;
  isRoot?: boolean;
  isEditMode?: boolean;
  handleSave?: (explainType: ExplainType, explain: string) => void;
}

export interface MarkdownEditorState {
  nowTab: EditMode;
  edit?: boolean;
  source?: string;
  editFrameHeight?: number;
}

export default class MarkdownEditor extends React.Component<
  MarkdownEditorProps,
  MarkdownEditorState
> {
  private explainContentRef: React.RefObject<HTMLTextAreaElement>;
  private cursorPosition: number = -1;

  constructor(props: MarkdownEditorProps) {
    super(props);

    const { source } = this.props;
    this.state = {
      source,
      nowTab: 'edit',
      edit: false,
      editFrameHeight: 200,
    };
    this.explainContentRef = React.createRef();
  }

  componentWillReceiveProps(nextProps: MarkdownEditorProps) {
    if (nextProps.isEditMode !== this.props.isEditMode) {
      this.setState({
        edit: false,
      });
    }
  }

  componentDidUpdate() {
    console.log('reload');
    if (this.cursorPosition !== -1) {
      const explainTextarea = this.explainContentRef.current;
      if (explainTextarea) {
        explainTextarea.focus();
      }
      if (this.cursorPosition && explainTextarea) {
        explainTextarea.setSelectionRange(
          this.cursorPosition,
          this.cursorPosition,
        );
      }
      this.cursorPosition = -1;
    }
  }

  handleCursor = (position?: number, explainTextarea?: HTMLTextAreaElement) => {
    console.log('posiion', position);
    console.log('source', this.state.source.length);
    if (explainTextarea) {
      explainTextarea.focus();
    }
    if (position && explainTextarea) {
      explainTextarea.setSelectionRange(position, position);
    }
  };

  handleTabClick = (nowTab: EditMode) => {
    this.setState({ nowTab });
  };

  handleSave = (type: ExplainType) => {
    this.setState({
      edit: false,
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

    const explainType = e.currentTarget.name;

    fetch(`http://${location.host}/upload`, {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((resObj) => {
        const savePath = resObj.path;

        // Add markdown image element to current explain.
        const currentExplain = that.state.source as string;
        const explainTextarea = this.explainContentRef.current;
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
      edit: true,
    });
  };

  changePosition = (position: number) => {
    this.cursorPosition = position;
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

  renderEditFrame = (): React.ReactNode => {
    const { isRoot, type } = this.props;
    const { nowTab, edit } = this.state;

    return (
      <div className={classnames('editor', { 'is-root': isRoot })}>
        {this.renderTabWrapper(type)}
        <MarkdownTool
          explainContentRef={this.explainContentRef}
          source={this.state.source}
          changePosition={this.changePosition}
          changeState={this.changeState}
          edit={edit}
          cursorPosition={this.cursorPosition}
          handleCursor={this.handleCursor}>
          <Upload
            name="file"
            action={`http://${location.host}/upload`}
            accept=".jpg,.jpeg,.png,.gif"
            onSuccess={(body: { path: string }) => {
              const { source } = this.state;
              const explainTextarea = this.explainContentRef.current;
              const newExplainContent = insertStr(
                source,
                `![](${body.path})`,
                explainTextarea.selectionStart,
              );

              this.changePosition(
                source.slice(0, explainTextarea.selectionStart).length + 2,
              );
              this.setState({ source: newExplainContent });

              this.props.handleSave(name, newExplainContent);
            }}>
            <ToolButton>Img</ToolButton>
          </Upload>
        </MarkdownTool>
        {nowTab === 'edit' ? (
          <div>
            <textarea
              name={type}
              ref={this.explainContentRef}
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
          <Markdown
            source={this.state.source}
            className={classnames('markdown', 'preview-markdown', {
              'is-root': isRoot,
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

  renderNoExplainWrapper = () => {
    return (
      <NoExplainWrapper onClick={() => this.handleAddExplain()}>
        <img src={EditIcon} alt="edit-icon" style={{ width: '20px' }} />
        <span style={{ padding: '10px' }}>
          {this.props.isRoot
            ? this.props.type === 'pre'
              ? '填写此步骤的介绍文字'
              : '填写此步骤的总结文字'
            : this.props.type === 'pre'
              ? '填写修改此文件的介绍文字'
              : '填写修改此文件的解释文字'}
        </span>
      </NoExplainWrapper>
    );
  };

  renderEditExplainStr = (): React.ReactNode => {
    const { type } = this.props;

    return (
      <EditExplainWrapper>
        {this.renderExplainStr()}
        {this.state.source
          ? this.renderHasExplainButton()
          : this.renderNoExplainWrapper()}
      </EditExplainWrapper>
    );
  };

  renderExplainStr = (): React.ReactNode => {
    const { isRoot } = this.props;
    return (
      <Markdown
        source={this.state.source}
        className={classnames('markdown', { 'is-root': isRoot })}
      />
    );
  };

  renderExplain = (isEditMode: boolean): React.ReactNode => {
    return isEditMode
      ? this.state.edit
        ? this.renderEditFrame()
        : this.renderEditExplainStr()
      : this.renderExplainStr();
  };

  render() {
    const { isEditMode } = this.props;
    return this.renderExplain(isEditMode);
  }
}
