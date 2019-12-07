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

import Viewer from './Viewer';
import { SaveButton } from './common';
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
  timeout?: any;
}

class Editor extends React.Component<EditorProps, EditorState> {
  constructor(props: EditorProps) {
    super(props);

    this.state = {
      nowTab: 'edit',
      timeout: null,
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

  updateContent = (content: string) => {
    this.props.updateContent(content);
  };

  handleSave = () => {
    const { type, markdown } = this.props;
    markdown.handleSave(type, this.props.source);
  };

  handleComplete = () => {
    this.handleSave();
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

  resetTimeout = (id, newId) => {
    clearTimeout(id);

    return newId;
  };

  handleChange = ({ html, text }) => {
    // @ts-ignore
    this.props.updateContent(text);

    const { timeout } = this.state;
    this.setState({
      timeout: this.resetTimeout(timeout, setTimeout(this.handleSave, 1000)),
    });
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
          <SaveButton onClick={this.handleComplete}>
            {t('saveButton')}
          </SaveButton>
        </div>
      </div>
    );
  }
}

export default translate('translations')(Editor);
