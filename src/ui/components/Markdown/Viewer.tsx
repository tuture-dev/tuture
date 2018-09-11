import React from 'react';
import marked from 'marked';
import hljs from 'highlight.js';

export interface ViewerProps {
  source: string;
  classnames?: string;
}

export default class Viewer extends React.Component<ViewerProps> {
  el: HTMLElement;

  getMarkdownText(source: string) {
    if (!source) {
      return;
    }
    marked.setOptions({
      gfm: true,
      breaks: true,
    });
    const rawMarkup = marked(source, { sanitize: true });
    return { __html: rawMarkup };
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

  render() {
    const { source, classnames } = this.props;
    return (
      <div
        ref={this.setEl}
        dangerouslySetInnerHTML={this.getMarkdownText(source)}
        className={classnames}
      />
    );
  }
}
