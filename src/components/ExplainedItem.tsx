import React, { PureComponent } from 'react';
import styled, { injectGlobal } from 'styled-components';
import classnames from 'classnames';
import _ from 'lodash';
import fetch from 'isomorphic-fetch';

// @ts-ignore
import Markdown from 'react-markdown';

import { Explain } from '../types';
import { isClientOrServer } from '../utils/common';

type ExplainType = 'pre' | 'post';
type EditMode = 'edit' | 'preview';
type ToolType =
  | 'b'
  | 'i'
  | 'h'
  | 'list'
  | 'blockquotes'
  | 'link'
  | 'img'
  | 'code'
  | 'block code';

interface ExplainedItemProps {
  explain: Explain;
  isRoot: boolean;
  isEditMode: boolean;
  commit: string;
  diffKey: string;
  updateTutureExplain: (
    commit: string,
    diffKey: string,
    name: ExplainType,
    value: string,
  ) => void;
}

interface ExplainedItemState extends Explain {
  nowTab: EditMode;
  preHeight: number;
  postHeight: number;
  preNowEdit: boolean;
  postNowEdit: boolean;
  [key: string]: string | number | boolean;
}

injectGlobal`
  .markdown p, li {
    font-family: Georgia;
    font-size: 18px;
    line-height: 1.58;
    margin: 24px 0 0 0;
    color: rgba(0,0,0,0.84);
  }

  .markdown li {
    margin: 8px 0;
  }

  .markdown h1 {
    font-size: 3px;
    font-family: LucidaGrande-Bold;
  }

  .markdown h2 {
    font-size: 31px;
    font-family: LucidaGrande-Bold;
  }

  .markdown h3 {
    font-size: 26px;
    font-family: LucidaGrande-Bold;
  }

  .markdown pre {
    font-family: Monaco,Menlo,"Courier New",Courier,monospace;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0,0,0,0.66);
    display: block;
    padding: 20px;
    background-color: rgba(0, 0, 0, .05);
    margin: 32px 0 !important;
  }

  .markdown a {
    color: rgba(0,0,0,0.84);
    text-decoration: none;
    border-bottom: 1px solid rgba(0,0,0,0.84);
    &:hover {
      cursor: pointer;
    }
  }

  .markdown img {
    display: block;
    width: 680px;
    margin: 44px 0;
  }

  .markdown :not(pre) > code {
    font-family: Monaco,Monaco,"Courier New",Courier,monospace;
    background-color: rgba(0, 0, 0, .05);
    padding: 3px 4px;
    margin: 0 2px;
    font-size: 14px;
  }

  .markdown blockquote {
    font-style: italic;
    margin-top: 28px;
    border-left: 3px solid rgba(0,0,0,.84);
    padding-left: 20px;
    margin-left: -21px;
    padding-bottom: 2px;
  }

  .markdown blockquote p {
    margin: 0;
    line-height: 1.58;
  }

  .markdown blockquote :not(pre) > code {
    font-style: normal;
  }

  .markdown.preview-markdown {
    box-sizing: border-box;
    padding: 20px;
    border: 1px solid #d1d5da;
    border-radius: 0 4px 4px;
  }

  .markdown.preview-markdown p:first-child {
    margin-top: 0;
  }

  .markdown.preview-markdown li:first-child {
    margin-top: 0;
  }

  .markdown.preview-markdown h1:first-child {
    margin-top: 0;
  }

  .markdown.preview-markdown h2:first-child {
    margin-top: 0;
  }

  .is-root {
    padding: 0 24px 12px;
  }

  .editor > .is-root {
    padding-left: 0;
    padding-right: 0;
  }

  .editor > .is-root.preview-markdown {
    padding: 20px;
  }

  textarea {
    display: block;
    width: 100%;
    height: auto;
    overflow-y: hidden;
    vertical-align: top;
    box-sizing: border-box;
    font-family: Georgia;
    padding: 20px;
    resize: none;
    font-size: 18px;
    border: 1px solid #d1d5da;
    border-radius: 0 4px 4px;
    &:focus {
      outline: none;
    }
  }
`;

/* tslint:disable-next-line */
const BasicButton = styled.button`
  height: 30px;
  line-height: 30px;
  padding: 0 18px;
  font-size: 12px;
  box-sizing: border-box;
  position: relative;
  background-color: white;
  outline: none;
  &:hover {
    outline: none;
    cursor: pointer;
  }
`;

/* tslint:disable-next-line */
const SaveButton = styled(BasicButton)`
  color: #00b887;
  border: none;
`;

/* tslint:disable-next-line */
const ToolButton = styled.button`
  margin-right: 10px;
`;

/* tslint:disable-next-line */
const Button = styled(BasicButton)`
  border: ${(props: { selected?: boolean; color?: string }) =>
    props.color
      ? `1px solid ${props.color}`
      : props.selected
        ? '1px solid #d1d5da;'
        : '1px solid transparent'};
  border-bottom: ${(props: { selected?: boolean; color?: string }) =>
    props.color ? `1px solid ${props.color}` : props.selected && '0'};
  border-radius: ${(props: { selected?: boolean; color?: string }) =>
    props.color ? '4px' : '3px 3px 0 0'};
  color: ${(props: { selected?: boolean; color?: string }) =>
    props.color
      ? props.color
      : props.selected
        ? 'rgba(0,0,0,.84)'
        : 'rgba(0,0,0,.84)'};
  bottom: ${(props: { selected?: boolean; color?: string }) =>
    props.selected ? '-1px' : 0};
`;

/* tslint:disable-next-line */
const TabWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

/* tslint:disable-next-line */
const EditExplainWrapper = styled.div`
  width: 100%;
  position: relative;
`;

/* tslint:disable-next-line */
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

/* tslint:disable-next-line */
const HasExplainButton = styled(BasicButton)`
  color: ${(props: { color: string; border: string }) => props.color};
  border: ${(props: { color: string; border: string }) => props.border};
  border-radius: 4px;
  margin-right: 30px;
`;

/* tslint:disable-next-line */
const NoExplainWrapper = styled.div`
  display: block;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #00b887;
  color: #00b887;
  padding: 20px;
  opacity: 0.3;
  border-radius: 3px;
  text-align: center;
  cursor: pointer;
`;

/* tslint:disable-next-line */
const StyledExplainedItem = styled.div`
  &:hover ${NoExplainWrapper} {
    opacity: 1;
  }
`;

export default class ExplainedItem extends PureComponent<
  ExplainedItemProps,
  ExplainedItemState
> {
  private explainContentRef: React.RefObject<HTMLTextAreaElement>;
  private mdToolType: string = null;
  constructor(props: ExplainedItemProps) {
    super(props);
    const { pre, post } = props.explain || { pre: '', post: '' };

    this.state = {
      pre,
      post,
      nowTab: 'edit',
      preHeight: 200,
      postHeight: 200,
      preNowEdit: false,
      postNowEdit: false,
    };

    this.explainContentRef = React.createRef();
  }

  componentWillReceiveProps(nextProps: ExplainedItemProps) {
    if (nextProps.isEditMode !== this.props.isEditMode) {
      this.setState({
        preNowEdit: false,
        postNowEdit: false,
      });
    }
  }

  componentDidUpdate(
    prevProps: ExplainedItemProps,
    prevState: ExplainedItemState,
  ) {
    if (this.mdToolType && prevState.mdToolType !== this.mdToolType) {
      const explainTextarea = this.explainContentRef.current;
      const explainLen = explainTextarea.value.length;
      explainTextarea.focus();
      if (this.mdToolType === 'b') {
        explainTextarea.setSelectionRange(explainLen - 2, explainLen - 2);
      } else if (this.mdToolType === 'i' || this.mdToolType === 'code') {
        explainTextarea.setSelectionRange(explainLen - 1, explainLen - 1);
      } else if (this.mdToolType === 'block code') {
        explainTextarea.setSelectionRange(explainLen - 4, explainLen - 4);
      }
      this.mdToolType = null;
    }
  }

  handleChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const { name, value, scrollHeight } = e.currentTarget;
    const explainState = { [name]: value } as Explain;
    this.setState({
      ...explainState,
      [`${name}Height`]: scrollHeight <= 200 ? 200 : scrollHeight,
    });
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

    console.log(`handleImageUpload before fetch: ${e.currentTarget.name}`);
    const explainType = e.currentTarget.name;

    fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((resObj) => {
        const savePath = resObj.path;
        console.log(savePath);

        // Add markdown image element to current explain.
        console.log(e);
        console.log(`handleImageUpload getSavePath: ${explainType}`);
        let currentExplain = that.state[explainType] as string;
        currentExplain += `![](${savePath})`;
        console.log(currentExplain);
        const explainState = {
          [explainType]: currentExplain,
        };
        this.setState({ ...explainState });
        const { updateTutureExplain, commit, diffKey } = that.props;
        updateTutureExplain(
          commit,
          diffKey,
          name as ExplainType,
          currentExplain,
        );
      });
  }

  handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    this.handleImageUpload(e, 'paste');
  };

  handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    this.handleImageUpload(e, 'drop');
  };

  handleTabClick = (nowTab: EditMode) => {
    this.setState({ nowTab });
  };

  handleAddExplain = (type: ExplainType) => {
    this.setState({
      [`${type}NowEdit`]: true,
    });
  };

  handleDelete = (type: ExplainType) => {
    const { updateTutureExplain, commit, diffKey } = this.props;
    updateTutureExplain(commit, diffKey, type, '');
    this.setState({ [type]: '' });
  };

  renderExplainStr = (type: ExplainType): React.ReactNode => {
    const { isRoot } = this.props;
    return (
      <Markdown
        source={this.state[type]}
        className={classnames('markdown', { 'is-root': isRoot })}
      />
    );
  };

  renderEditExplainStr = (type: ExplainType): React.ReactNode => {
    const explainContent = this.state[type];
    return (
      <EditExplainWrapper>
        {this.renderExplainStr(type)}
        {explainContent ? (
          <HasExplainWrapper>
            <div>
              <HasExplainButton
                color="rgba(0,0,0,0.84)"
                border="1px solid rgba(0,0,0,0.84)"
                onClick={() => this.handleAddExplain(type)}>
                编辑
              </HasExplainButton>
              <HasExplainButton
                color="#cb2431"
                border="1px solid #cb2431"
                onClick={() => this.handleDelete(type)}>
                删除
              </HasExplainButton>
            </div>
          </HasExplainWrapper>
        ) : (
          <NoExplainWrapper onClick={() => this.handleAddExplain(type)}>
            加一点解释 +
          </NoExplainWrapper>
        )}
      </EditExplainWrapper>
    );
  };

  handleSave = (type: ExplainType) => {
    this.setState({
      [`${type}NowEdit`]: false,
    });

    const { updateTutureExplain, commit, diffKey } = this.props;
    updateTutureExplain(commit, diffKey, type, this.state[type]);
  };

  spliceStr = (str = '', typeStr: string, start: number, end: number) => {
    return str
      .slice(0, start)
      .concat(
        typeStr,
        str.slice(start, end),
        typeStr,
        str.slice(end, str.length),
      );
  };

  handleMdTool = (type: ExplainType, toolType: ToolType) => {
    if (this.state[`${type}NowEdit`]) {
      const explainContent = this.state[type];
      const explainTextarea = this.explainContentRef.current;
      const selectedContent = explainContent.slice(
        explainTextarea.selectionStart,
        explainTextarea.selectionEnd,
      );
      let resultContent = '';
      switch (toolType) {
        case 'b': {
          if (selectedContent) {
            this.setState({
              [type]: this.spliceStr(
                explainContent,
                '**',
                explainTextarea.selectionStart,
                explainTextarea.selectionEnd,
              ),
            });
          } else {
            this.mdToolType = 'b';
            this.setState({
              [type]: `${explainContent}****`,
            });
          }
          break;
        }
        case 'i':
          if (selectedContent) {
            this.setState({
              [type]: this.spliceStr(
                explainContent,
                '*',
                explainTextarea.selectionStart,
                explainTextarea.selectionEnd,
              ),
            });
          } else {
            this.mdToolType = 'i';
            this.setState({
              [type]: `${explainContent}**`,
            });
          }
          break;
        case 'h': {
          !explainContent || explainContent.endsWith('\n')
            ? this.setState({ [type]: `${explainContent}#### ` })
            : this.setState({ [type]: `${explainContent}\n#### ` });
          break;
        }
        case 'list':
          if (selectedContent) {
            let resultContent = '';
            const listItems = selectedContent.split('\n');
            listItems.map((item) => {
              if (item) {
                resultContent += `- ${item}\n`;
              }
            });
            this.setState({
              [type]: explainContent
                .slice(0, explainTextarea.selectionStart)
                .concat(
                  resultContent,
                  explainContent.slice(
                    explainTextarea.selectionEnd,
                    explainContent.length,
                  ),
                ),
            });
          } else {
            !explainContent || explainContent.endsWith('\n')
              ? this.setState({ [type]: `${explainContent}- ` })
              : this.setState({ [type]: `${explainContent}\n- ` });
          }
          break;
        case 'blockquotes':
          !explainContent || explainContent.endsWith('\n')
            ? this.setState({ [type]: `${explainContent}> ` })
            : this.setState({ [type]: `${explainContent}\n> ` });
          break;
        case 'code':
          if (selectedContent) {
            this.setState({
              [type]: this.spliceStr(
                explainContent,
                '`',
                explainTextarea.selectionStart,
                explainTextarea.selectionEnd,
              ),
            });
          } else {
            this.mdToolType = 'code';
            this.setState({
              [type]: explainContent + '``',
            });
          }
          break;
        case 'block code':
          if (selectedContent) {
            this.setState({
              [type]: this.spliceStr(
                explainContent,
                '\n```\n',
                explainTextarea.selectionStart,
                explainTextarea.selectionEnd,
              ),
            });
          } else {
            this.mdToolType = 'block code';
            !explainContent || explainContent.endsWith('\n')
              ? this.setState({ [type]: explainContent + '```\n\n```' })
              : this.setState({ [type]: explainContent + '\n```\n\n```' });
          }
          break;
        case 'link':
          if (selectedContent) {
            resultContent = `${explainContent.slice(
              0,
              explainTextarea.selectionStart,
            )}[${selectedContent}]()${explainContent.slice(
              explainTextarea.selectionEnd,
              explainContent.length,
            )}`;
            this.setState({
              [type]: resultContent,
            });
          } else {
            this.setState({
              [type]: `${explainContent}[example](http://example.com/)`,
            });
          }

          break;
        case 'img':
          this.setState({
            [type]: explainContent + '',
          });
          break;
        default:
          break;
      }
      explainTextarea.focus();
    }
  };

  nowEditFrame = (type: ExplainType): React.ReactNode => {
    const { isRoot } = this.props;
    const { nowTab } = this.state;
    return (
      <div className={classnames('editor', { 'is-root': isRoot })}>
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
        {nowTab === 'edit' ? (
          <div>
            <div
              className="markdown-toolbar"
              style={{
                border: '1px solid #d1d5da',
                borderBottom: 'none',
                height: '30px',
                padding: '5px 10px',
                lineHeight: '30px',
              }}>
              <ToolButton onClick={() => this.handleMdTool(type, 'b')}>
                <b>B</b>
              </ToolButton>
              <ToolButton onClick={() => this.handleMdTool(type, 'i')}>
                <i>I</i>
              </ToolButton>
              <ToolButton onClick={() => this.handleMdTool(type, 'h')}>
                H
              </ToolButton>
              <ToolButton onClick={() => this.handleMdTool(type, 'list')}>
                List
              </ToolButton>
              <ToolButton
                onClick={() => this.handleMdTool(type, 'blockquotes')}>
                Blockquotes
              </ToolButton>
              <ToolButton onClick={() => this.handleMdTool(type, 'code')}>
                Code
              </ToolButton>
              <ToolButton onClick={() => this.handleMdTool(type, 'block code')}>
                Block Code
              </ToolButton>
              <ToolButton onClick={() => this.handleMdTool(type, 'link')}>
                Link
              </ToolButton>
              <ToolButton onClick={() => this.handleMdTool(type, 'img')}>
                Img
              </ToolButton>
            </div>
            <textarea
              name={type}
              value={this.state[type]}
              placeholder="写一点解释..."
              onChange={this.handleChange}
              onPaste={this.handlePaste}
              onDrop={this.handleDrop}
              style={{ height: this.state[`${type}Height`] as number }}
              ref={this.explainContentRef}
            />
          </div>
        ) : (
          <Markdown
            source={this.state[type]}
            className={classnames('markdown', 'preview-markdown', {
              'is-root': isRoot,
            })}
          />
        )}
      </div>
    );
  };

  renderExplain = (type: ExplainType, isEditMode: boolean): React.ReactNode => {
    return isEditMode
      ? this.state[`${type}NowEdit`]
        ? this.nowEditFrame(type)
        : this.renderEditExplainStr(type)
      : this.renderExplainStr(type);
  };

  render() {
    const { isEditMode } = this.props;
    return (
      <StyledExplainedItem>
        {this.renderExplain('pre', isEditMode)}
        {this.props.children}
        {this.renderExplain('post', isEditMode)}
      </StyledExplainedItem>
    );
  }
}
