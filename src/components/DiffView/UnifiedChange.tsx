import React, { PureComponent } from 'react';
import classnames from 'classnames';

import { Change as ChangeType } from '../ContentItem';
import { Cell } from './SplitChange';

import {
  computeOldLineNumber,
  computeNewLineNumber,
} from './utils';

interface UnifiedChangeProps {
  change: ChangeType;
}

export default class UnifiedChange extends PureComponent<UnifiedChangeProps> {
  renderGutterCell = ({
    hide,
    className,
    lineNumber,
    gutterAnchor,
    anchorID,
    ...props
  }: Cell): React.ReactNode => {
    if (hide) {
      return null;
    }

    return (
      <td className={className} data-line-number={lineNumber} {...props}>
        {
          gutterAnchor
          ? <a href={`#${anchorID}`} data-line-number={lineNumber} />
          : null
        }
      </td>
    );
  }

  render() {
    const {
      change,
    } = this.props;

    const { type, content } = change;
    const oldLine = computeOldLineNumber(change);
    const oldLineNumber = oldLine === -1 ? undefined : oldLine;
    const newLine = computeNewLineNumber(change);
    const newLineNumber = newLine === -1 ? undefined : newLine;

    const gutterClassName = classnames(
      'diff-gutter',
      `diff-gutter-${type}`,
    );
    const codeClassName = classnames(
      'diff-code',
      `diff-code-${type}`,
    );

    return (
      <tr className={classnames('diff-line')}>
        {
          this.renderGutterCell({
            className: gutterClassName,
            lineNumber: oldLineNumber,
          })
        }
        {
          this.renderGutterCell({
            className: gutterClassName,
            lineNumber: newLineNumber
          })
        }
        <td className={codeClassName}>{content}</td>
      </tr>
    );
  }
}
