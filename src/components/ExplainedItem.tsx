import React, { PureComponent } from 'react';
import { inject, observer } from 'mobx-react';

import { Explain } from '../types';
import { ExplainType } from '../types/ExplainedItem';
import Markdown from './Markdown/';
import Store from './store';

interface ExplainedItemProps {
  explain: Explain;
  isRoot: boolean;
  commit: string;
  diffKey: string;
  store?: Store;
  updateTutureExplain: (
    commit: string,
    diffKey: string,
    name: ExplainType,
    value: string,
  ) => void;
}

interface ExplainedItemState extends Explain {}

@inject('store')
@observer
export default class ExplainedItem extends PureComponent<
  ExplainedItemProps,
  ExplainedItemState
> {
  handleSave = (type: ExplainType, value: string) => {
    const { updateTutureExplain, commit, diffKey } = this.props;
    updateTutureExplain(commit, diffKey, type, value);
  };

  renderExplain = (type: ExplainType) => {
    const { isRoot, store } = this.props;
    let { explain } = this.props;
    explain = explain || { pre: '', post: '' };

    return (
      <Markdown
        type={type}
        source={explain[type]}
        isEditMode={store.isEditMode}
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
