import React from 'react';
import marked from 'marked';

export interface ViewerProps {
  source: string;
  classnames?: string;
}

export default class Viewer extends React.Component<ViewerProps> {
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

  render() {
    const { source, classnames } = this.props;
    return (
      <div
        dangerouslySetInnerHTML={this.getMarkdownText(source)}
        className={classnames}
      />
    );
  }
}
