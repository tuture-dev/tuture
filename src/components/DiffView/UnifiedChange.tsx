import React, { PureComponent } from 'react';
import classnames from 'classnames';

import { Change as ChangeType } from '../../types';
import Snippet from './Snippet';

import { computeOldLineNumber, computeNewLineNumber } from './utils';

interface UnifiedChangeProps {
  change: ChangeType;
}

export default class UnifiedChange extends PureComponent<UnifiedChangeProps> {
  render() {
    const { change } = this.props;

    const { type, content } = change;
    const oldLine = computeOldLineNumber(change);
    const oldLineNumber = oldLine === -1 ? undefined : oldLine;
    const newLine = computeNewLineNumber(change);
    const newLineNumber = newLine === -1 ? undefined : newLine;

    const gutterClassName = classnames('diff-gutter', `diff-gutter-${type}`);
    const codeClassName = classnames('diff-code', `diff-code-${type}`);

    return (
      <tr className={classnames('diff-line')}>
        <td className={codeClassName}>
          <Snippet code={content} />
        </td>
      </tr>
    );
  }
}
