import React, { PureComponent } from 'react';

import { Explain } from '../types';
import { ExplainType } from '../types/ExplainedItem';
import MarkdownEditor from './MarkdownEditor';

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

interface ExplainedItemState extends Explain {}

export default class ExplainedItem extends PureComponent<
  ExplainedItemProps,
  ExplainedItemState
> {
  handleSave = (type: ExplainType, value: string) => {
    const { updateTutureExplain, commit, diffKey } = this.props;
    updateTutureExplain(commit, diffKey, type, value);
  };

  renderExplain = (type: ExplainType) => {
    const { isEditMode, isRoot } = this.props;
    let { explain } = this.props;
    explain = explain || { pre: '', post: '' };

    return (
      <MarkdownEditor
        type={type}
        source={explain[type]}
        isEditMode={isEditMode}
        isRoot={isRoot}
        handleSave={this.handleSave}
      />
    );
  };

  render() {
    return (
      <div>
        {this.renderExplain('pre')}
        {this.props.children}
        {this.renderExplain('post')}
      </div>
    );
  }
}
