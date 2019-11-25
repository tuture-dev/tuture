import React from 'react';
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import insert from 'markdown-it-ins';
import container from 'markdown-it-container';

export interface ViewerProps {
  source: string;
  classnames?: string;
  isEditMode?: boolean;
  onClick?: () => {};
}

export default class Viewer extends React.Component<ViewerProps> {
  el: HTMLElement;

  constructor(props) {
    super(props);

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

  getMarkdownText(source: string) {
    if (!source) {
      return;
    }

    // @ts-ignore
    return { __html: this.mdParser.render(source) };
  }

  componentDidMount() {
    this.highlightCode();
    this.openLinkInNewWindow();
  }

  componentDidUpdate() {
    this.highlightCode();
    this.openLinkInNewWindow();
  }

  highlightCode() {
    const nodes = this.el.querySelectorAll('pre code');

    for (let i = 0; i < nodes.length; i += 1) {
      hljs.highlightBlock(nodes[i]);
    }
  }

  openLinkInNewWindow() {
    const nodes = this.el.querySelectorAll('a');

    for (let i = 0; i < nodes.length; i += 1) {
      nodes[i].target = '_blank';
    }
  }

  setEl = (el: HTMLElement) => {
    this.el = el;
  };

  handleClick = () => {
    const { isEditMode } = this.props;

    if (isEditMode) {
      this.props.onClick();
    }
  };

  render() {
    const { source, classnames } = this.props;
    return (
      <div
        ref={this.setEl}
        dangerouslySetInnerHTML={this.getMarkdownText(source)}
        className={classnames}
        onClick={this.handleClick}
      />
    );
  }
}
