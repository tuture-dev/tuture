import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { inject, observer, Provider } from 'mobx-react';

import Markdown from './Markdown';
import Store from '../store';

interface ExplainedItemProps {
  explain: Explain;
  isRoot: boolean;
  commit: string;
  diffKey: string;
  store?: Store;
}

export class MarkdownStore {
  @observable
  commit: string;

  @observable
  diffKey: string;

  @observable
  type: ExplainType;

  @observable
  value: string;

  @observable
  store: Store;

  constructor(commit: string, diffKey: string, store: Store) {
    this.commit = commit;
    this.diffKey = diffKey;
    this.store = store;
  }

  @action
  handleSave(type: ExplainType, value: string) {
    this.store.updateTutureExplain(this.commit, this.diffKey, type, value);
    this.store.saveTuture();
  }
}

interface ExplainedItemState extends Explain {}

@inject('store')
@observer
export default class ExplainedItem extends Component<
  ExplainedItemProps,
  ExplainedItemState
> {
  private markdown: MarkdownStore;
  constructor(props: ExplainedItemProps) {
    super(props);

    const { commit, diffKey, store } = this.props;
    this.markdown = new MarkdownStore(commit, diffKey, store);
  }

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
      />
    );
  };

  render() {
    return (
      <Provider markdown={this.markdown}>
        <div>
          {this.renderExplain('pre')}
          {this.props.children}
          {this.renderExplain('post')}
        </div>
      </Provider>
    );
  }
}
