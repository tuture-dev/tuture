import React from 'react';
import classnames from 'classnames';

import MarkdownViewer from './MarkdownViewer';
import MarkdownEditor from './MarkdownEditor';
import { ExplainType } from '../../types/ExplainedItem';

export interface MarkdownProps {
  source: string;
  type: ExplainType;
  classnames?: string;
  isRoot?: boolean;
  isEditMode?: boolean;
  handleSave?: (explainType: ExplainType, explain: string) => void;
}

export default class Markdown extends React.Component<MarkdownProps> {
  render() {
    const { isEditMode, source, isRoot } = this.props;

    return isEditMode ? (
      <MarkdownEditor {...this.props} />
    ) : (
      <MarkdownViewer
        source={source}
        classnames={classnames('markdown', { isRoot })}
      />
    );
  }
}
