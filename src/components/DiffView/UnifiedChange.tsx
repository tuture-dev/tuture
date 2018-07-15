import React, { PureComponent } from 'react';
import classnames from 'classnames';

import { Change as ChangeType } from '../../types';
import Snippet from './Snippet';

interface UnifiedChangeProps {
  change: ChangeType;
}

export default class UnifiedChange extends PureComponent<UnifiedChangeProps> {
  render() {
    const { change } = this.props;

    const { type, content } = change;
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
