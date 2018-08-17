import React, { PureComponent } from 'react';

import { Explain } from '../types';
import { ExplainType } from '../types/ExplainedItem';
import Markdown from './Markdown/';
import { ModeContext } from './App';

interface ExplainedItemProps {
  explain: Explain;
  isRoot: boolean;
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
    const { isRoot } = this.props;
    let { explain } = this.props;
    explain = explain || { pre: '', post: '' };

    return (
      <ModeContext.Consumer>
        {({ isEditMode }) => (
          <Markdown
            type={type}
            source={explain[type]}
            isEditMode={isEditMode}
            isRoot={isRoot}
            handleSave={this.handleSave}
          />
        )}
      </ModeContext.Consumer>
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
