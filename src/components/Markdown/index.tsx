import React from 'react';
import classnames from 'classnames';

import Viewer from './Viewer';
import Editor from './Editor';
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
      <Editor {...this.props} />
    ) : (
      <Viewer source={source} classnames={classnames('markdown', { isRoot })} />
    );
  }
}
