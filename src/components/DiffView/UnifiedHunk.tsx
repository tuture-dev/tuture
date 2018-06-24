import React, { PureComponent } from 'react';
import classnames from 'classnames';

import UnifiedChange from './UnifiedChange';

import { Change as ChangeType, Hunk as HunkType } from '../../types';

import {
  computeOldLineNumber,
  computeNewLineNumber,
  getChangeKey,
} from './utils';

interface UnifiedHunkProps {
  hunk: HunkType;
}

export default class UnifiedHunk extends PureComponent<UnifiedHunkProps> {
  groupElements = (changes: ChangeType[]) => changes.reduce((elements: (string | ChangeType)[][], change: ChangeType) => {
    const key = getChangeKey(change);

    elements.push(['change', key, change]);

    // later will add widget content
    return elements;
  }, []);

  renderRow = ([type, key, value]: (string | ChangeType)[], i: number) => {
    if (type === 'change') {
      return (
        <UnifiedChange
          key={`change${key}`}
          change={value as ChangeType}
        />
      );
    }

    // later will add widget content
    return null;
  }

  render() {
    const {
      hunk,
    } = this.props;

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
