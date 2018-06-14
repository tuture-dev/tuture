import React, { PureComponent } from 'react';
import classnames from 'classnames';

import {
  computeOldLineNumber,
  computeNewLineNumber,
} from './utils';

import { Change as ChangeType } from '../ContentItem';

export interface SplitChangeProps {
  oldChange: ChangeType;
  newChange: ChangeType;
}

export interface Cell {
  side?: number;
  change?: ChangeType;
  gutterAnchor?: string;
  hideGutter?: boolean;
  gutterAnchorTarget?: string;
  anchorID?: number;
  lineNumber?: number;
  hide?: boolean;
  className?: string;
}

export default class SplitChange extends PureComponent<SplitChangeProps> {
  constructor(props: SplitChangeProps) {
    super(props);
  }

  SIDE_OLD = 0;
  SIDE_NEW = 1;

  renderCells = ({
    side,
    change,
    gutterAnchor,
    hideGutter,
    gutterAnchorTarget
  }: Cell): React.ReactNode => {
    if (!change) {
      const gutterClassName = classnames('diff-gutter', 'diff-gutter-omit');
      const codeClassName = classnames('diff-code', 'diff-code-omit');

      return [
        !hideGutter && <td key="gutter" className={gutterClassName} />,
        <td key="code" className={codeClassName} />,
      ];
    }

    const { type, content } = change;
    const line = side === this.SIDE_OLD
      ? computeOldLineNumber(change)
      : computeNewLineNumber(change)
    ;
    const gutterClassName = classnames(
      'diff-gutter',
      `diff-gutter-${type}`,
    );
    const gutterProps = {
      className: gutterClassName,
      'data-line-number': line,
      children: (
        gutterAnchor
        ? <a href={`#${gutterAnchorTarget}`} data-line-number={line} />
        : null
      ),
    };
    const codeClassName = classnames(
      'diff-code',
      `diff-code-${type}`,
    );
    const codeProps = {
      className: codeClassName,
    };

    return [
      !hideGutter && <td key="gutter" {...gutterProps} />,
      <td key="code" {...codeProps}>{content}</td>
    ];
  }

  render() {
    const {
      oldChange,
      newChange,
    } = this.props;

    const oldArgs = {
      change: oldChange,
      side: this.SIDE_OLD,
    };
    const newArgs = {
      change: newChange,
      side: this.SIDE_NEW,
    };

    const lineTypeClassName = ((oldChange, newChange) => {
      if (oldChange && !newChange) {
        return 'diff-line-old-only';
      }

      if (!oldChange && newChange) {
        return 'diff-line-new-only';
      }

      if (oldChange === newChange) {
        return 'diff-line-normal';
      }

      return 'diff-line-compare';
    })(oldChange, newChange);

    return (
      <tr className={classnames('diff-line')}>
        {this.renderCells(oldArgs)}
        {this.renderCells(newArgs)}
      </tr>
    );
  }
}
