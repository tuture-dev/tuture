import React from 'react';
import classnames from 'classnames';
import fetch from 'isomorphic-fetch';
import { translate } from 'react-i18next';

// @ts-ignore
import MdEditor from 'tuture-react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import insert from 'markdown-it-ins';
import container from 'markdown-it-container';
import hljs from 'highlight.js';

// @ts-ignore
import Upload from 'rc-upload';
import TextareaAutoresize from 'react-autosize-textarea';

import Viewer from './Viewer';
import {
  BasicButton,
  TabWrapper,
  SaveButton,
  ToolButton,
  UndoButton,
} from './common';
import Toolbar from './Toolbar';
import { insertStr } from './utils';
import Icon from '../Icon';
import { rem } from '../../utils';
import { ExplainType, EditMode } from '../../types';
import { MarkdownStore } from '../ExplainedItem';

interface EditorProps {
  source: string;
  type: ExplainType;
  isRoot?: boolean;
  classnames?: string;
  markdown?: MarkdownStore;
  t?: any;
  updateEditingStatus: (isEditing: boolean) => void;
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

class Editor extends React.Component<EditorProps, EditorState> {
  private contentRef: HTMLTextAreaElement;
  private cursorPos: number = -1;

  constructor(props: EditorProps) {
    super(props);

    this.state = {
      nowTab: 'edit',
      editFrameHeight: 200,
      contentRef: this.contentRef,
    };

    // @ts-ignore
    this.mdParser = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) {}
        }
        return ''; // use external default escaping
      },
    })
      .use(insert)
      .use(container, 'default', {
        render(tokens, idx) {
          if (tokens[idx].nesting === 1) {
            return "<div class='note default'>\n";
          }

          return '</div>\n';
        },
      })
      .use(container, 'primary', {
        render(tokens, idx) {
          if (tokens[idx].nesting === 1) {
            return "<div class='note primary'>\n";
          }

          return '</div>\n';
        },
      })
      .use(container, 'success', {
        render(tokens, idx) {
          if (tokens[idx].nesting === 1) {
            return "<div class='note success'>\n";
          }

          return '</div>\n';
        },
      })
      .use(container, 'info', {
        render(tokens, idx) {
          if (tokens[idx].nesting === 1) {
            return "<div class='note info'>\n";
          }

          return '</div>\n';
        },
      })
      .use(container, 'warning', {
        render(tokens, idx) {
          if (tokens[idx].nesting === 1) {
            return "<div class='note warning'>\n";
          }

          return '</div>\n';
        },
      })
      .use(container, 'danger', {
        render(tokens, idx) {
          if (tokens[idx].nesting === 1) {
            return "<div class='note danger'>\n";
          }

          return '</div>\n';
        },
      });
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
    const { type, markdown } = this.props;
    markdown.handleSave(type, this.props.source);
    this.props.updateEditingStatus(false);
  };

  handleUndo = () => {
    this.props.handleUndo();
    this.props.updateEditingStatus(false);
  };

  handleImageUpload(file, callback) {
    // Upload the first images to server.
    const data = new FormData();
    const that = this;
    data.append('file', file);

    fetch(`http://${location.host}/upload`, {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((resObj) => {
        const savePath = resObj.path;

        console.log('savePath', savePath);

        // Add markdown image element to current explain.
        callback(savePath);
      });
  }

  handleChange = ({ html, text }) => {
    // @ts-ignore
    console.log('html', this.mdEditor);
    this.props.updateContent(text);
  };

  changePosition = (position: number) => {
    this.cursorPos = position;
  };

  renderTabWrapper = () => {
    const { nowTab } = this.state;
    const { t } = this.props;
    return (
      <TabWrapper>
        <div>
          <TabButton
            name="edit"
            onClick={this.handleTabClick.bind(this, 'edit')}
            selected={nowTab === 'edit'}>
            {t('editTab')}
          </TabButton>
          <TabButton
            name="preview"
            onClick={this.handleTabClick.bind(this, 'preview')}
            selected={nowTab === 'preview'}>
            {t('previewTab')}
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
              accept=".jpg,.jpeg,.png,.gif">
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

  getTextareaRef = (ref) => {
    this.contentRef = ref;
  };

  render() {
    const { isRoot, type, t } = this.props;
    const { nowTab } = this.state;

    return (
      <div className={classnames('editor', 'mdContent')}>
        {nowTab === 'edit' ? (
          <div style={{ height: '500px' }}>
            <MdEditor
              name="textarea"
              // @ts-ignore
              ref={(node) => (this.mdEditor = node)}
              value={this.props.source || ''}
              config={{
                view: {
                  menu: true,
                  md: true,
                  html: true,
                },
              }}
              // @ts-ignore
              renderHTML={(text) => this.mdParser.render(text)}
              onChange={this.handleChange}
              onImageUpload={this.handleImageUpload}
              onImagePaste={this.handleImageUpload}
              onImageDrop={this.handleImageUpload}
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
          <SaveButton onClick={this.handleSave}>{t('saveButton')}</SaveButton>
          <UndoButton onClick={this.handleUndo}>{t('cancelButton')}</UndoButton>
        </div>
      </div>
    );
  }
}

export default translate('translations')(Editor);
