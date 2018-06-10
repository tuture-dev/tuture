import React, { PureComponent } from 'react';
import classnames from 'classnames';

import SplitChange from './SplitChange';

import { getChangeKey } from './utils';

export default class SplitHunk extends PureComponent {
  keyForPair = (x, y) => {
    const keyForX = x ? getChangeKey(x) : '00';
    const keyForY = y ? getChangeKey(y) : '00';

    return keyForX + keyForY;
  };

  groupElements = (changes) => {
    let elements = [];

    for (let i = 0; i < changes.length; i++) {
      const current = changes[i];

      if (current.isNormal) {
        elements.push(
          ['change', this.keyForPair(current, current), current, current]
        );
      } else if (current.isDelete) {
        const next = changes[i + 1];

        // If an insert change is following a delete change
        // they should be displayed side by side
        if (next && next.isInsert) {
          i = i + 1;
          elements.push(
            ['change', this.keyForPair(current, next), current, next]
          );
        } else {
          elements.push(
            ['change', this.keyForPair(current, null), current, null]
          );
        }
      } else {
        elements.push(
          ['change', this.keyForPair(null, current), null, current]
        );
      }
    }

    return elements;
  }

  renderRow = ([type, key, oldValue, newValue], i) => {
    if (type === 'change') {
      return (
        <SplitChange
          key={`change${key}`}
          oldChange={oldValue}
          newChange={newValue}
        />
      );
    }
  }

  render() {
    const { hunk } = this.props;
    const elements = this.groupElements(hunk.changes);

    return (
      <tbody className={classnames('diff-hunk')}>
        {
          elements.map((element, i) => this.renderRow(element, i))
        }
      </tbody>
    );
  }
}
