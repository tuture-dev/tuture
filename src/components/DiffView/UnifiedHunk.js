import React, { PureComponent } from 'react';
import classnames from 'classnames';

import UnifiedChange from './UnifiedChange';

import {
  computeOldLineNumber,
  computeNewLineNumber,
  getChangeKey,
} from './utils';

export default class UnifiedHunk extends PureComponent {
  groupElements = (changes) => changes.reduce((elements, change) => {
    const key = getChangeKey(change);

    elements.push(['change', key, change]);

    // later will add widget content
    return elements;
  }, []);

  renderRow = ([type, key, value], i) => {
    if (type === 'change') {
      return (
        <UnifiedChange
          key={`change${key}`}
          change={value}
        />
      );
    }

    // later will add widget content
    return null;
  }

  render() {
    const {
      hunk,
      className,
    } = this.props;

    const elements = this.groupElements(hunk.changes);

    return (
      <tbody className={classnames('diff-hunk', className)}>
        {
          elements.map((element, i) => this.renderRow(element, i))
        }
      </tbody>
    );
  }
}
