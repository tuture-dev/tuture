import React from 'react';
import marked from 'marked';

export interface MarkdownViewerProps {
  source: string;
  classnames?: string;
}

export default class MarkdownViewer extends React.Component<
  MarkdownViewerProps
> {
  getMarkdownText(source: string) {
    if (!source) {
      return;
    }
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
