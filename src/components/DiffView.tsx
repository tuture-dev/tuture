import React, { Component } from 'react';
import { injectGlobal } from 'styled-components';
import classnames from 'classnames';

import Snippet from './Snippet';

import { Change as ChangeType, Hunk as HunkType } from '../types';

interface DiffViewProps {
  startLine: number;
  hunks: HunkType[];
}

injectGlobal`
  .diff {
    table-layout: fixed;
    border-collapse: collapse;
    width: 100%;
  }

  .diff-gutter-col {
    width: 50px;
  }

  .diff td {
    vertical-align: top;
  }
  .diff-line {
    line-height: 31px;
    font-family: Consolas, Courier, monospace;
  }

  .diff-gutter {
    width: 8px;
    padding: 0 16px;
    color: rgba(0, 0, 0, .24);
  }

  .diff-gutter-insert {
    background-color: rgba(0, 0, 0, .07);
  }

  .diff-gutter-delete {
    background-color: rgba(0, 0, 0, .021);
  }

  .diff-gutter:empty:before {
    content: attr(data-line-number);
  }

  .diff-code-insert {
    font-weight: 700;
    background-color: rgba(0, 0, 0, .07);
  }

  .diff-code-delete {
    opacity: 0.3;
    background-color: rgba(0, 0, 0, .07);
  }

  .diff-code {
    padding: 0 20px;
    width: 557px;
  }
  .diff-file {
    color: rgba(0,0,0,0.84);
    display: block;
    padding-top: 8px;
    padding-bottom: 20px;
    background-color: rgba(0, 0, 0, .05);
    margin: 32px 0;
  }

  .diff-file-header {
    font-family: Monaco;
    font-size: 14px;
    color: rgba(0,0,0,0.24);
    text-align: right;
    padding-right: 20px;
  }

  .addition-count {
    margin-right: 1em;
    color: #88b149;
  }

  .deletion-count {
    margin-right: 1em;
    color: #ee5b60;
  }

`;

export default class DiffView extends Component<DiffViewProps> {
  renderLineNumber = (
    lineNumberClassName: string,
    lineNumber: number,
  ): React.ReactNode => {
    return <td className={lineNumberClassName} data-line-number={lineNumber} />;
  };

  renderRow = (change: ChangeType, isAllInsert: Boolean, i: number) => {
    const { type, content } = change;
    const lineNumberClassName = classnames('diff-gutter', {
      [`diff-gutter-${type}`]: !isAllInsert,
    });
    const codeClassName = classnames('diff-code', {
      [`diff-code-${type}`]: !isAllInsert,
    });
    return (
      <tr key={`change${i}`} className={classnames('diff-line')}>
        {this.renderLineNumber(lineNumberClassName, this.props.startLine + i)}
        <td className={codeClassName}>
          <Snippet code={content} />
        </td>
      </tr>
    );
  };

  judgeAllRowInsertState = (changes: ChangeType[]) => {
    let isAllInsert = true;
    changes.map((change: ChangeType) => {
      const { type } = change;
      if (type !== 'insert') {
        isAllInsert = false;
      }
    });
    return changes.map((change, i) => {
      return this.renderRow(change, isAllInsert, i);
    });
  };

  render() {
    const { hunks } = this.props;

    return (
      <table className="diff">
        {hunks.map((hunk: HunkType, key: number) => (
          <tbody key={key} className={classnames('diff-hunk')}>
            {this.judgeAllRowInsertState(hunk.changes)}
          </tbody>
        ))}
      </table>
    );
  }
}
