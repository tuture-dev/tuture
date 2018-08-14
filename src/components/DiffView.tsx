import React, { Component } from 'react';
import { injectGlobal } from 'styled-components';
import classnames from 'classnames';

import Snippet from './Snippet';

interface NormalChange {
  type: 'normal';
  ln1: number;
  ln2: number;
  normal: true;
  content: string;
}

interface AddChange {
  type: 'add';
  add: true;
  ln: number;
  content: string;
}

interface DeleteChange {
  type: 'del';
  del: true;
  ln: number;
  content: string;
}

type Change = NormalChange | AddChange | DeleteChange;

export interface Chunk {
  content: string;
  changes: Change[];
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
}

export interface File {
  chunks: Chunk[];
  deletions: number;
  additions: number;
  from?: string;
  to?: string;
  index?: string[];
  deleted?: true;
  new?: true;
}

export interface DiffItem {
  commit: string;
  diff: File[];
}

interface DiffViewProps {
  lang: string;
  startLine: number;
  chunks: Chunk[];
  id?: string;
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

  .diff-gutter-add {
    background-color: rgba(0, 0, 0, .07);
  }

  .diff-gutter-del {
    background-color: rgba(0, 0, 0, .021);
  }

  .diff-gutter:empty:before {
    content: attr(data-line-number);
  }

  .diff-code-add {
    font-weight: 700;
    background-color: rgba(0, 0, 0, .07);
  }

  .diff-code-del {
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
    text-align: left;
    padding-left: 20px;
    padding-bottom: 5px;
    position: relative;
  }
  .diff-file-copyButton{
    float: right;
    margin-right: 15px;
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

  renderRow = (change: Change, isAllInsert: Boolean, i: number) => {
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
          <Snippet code={content.slice(1)} lang={this.props.lang} />
        </td>
      </tr>
    );
  };

  judgeAllRowInsertState = (changes: Change[]) => {
    let isAllInsert = true;
    changes.map((change) => {
      const { type } = change;
      if (type !== 'add') {
        isAllInsert = false;
      }
    });
    return changes.map((change, i) => {
      return this.renderRow(change, isAllInsert, i);
    });
  };

  render() {
    const { chunks, id } = this.props;

    return (
      <table className="diff" id={id}>
        {chunks.map((chunk: Chunk, key: number) => (
          <tbody key={key} className={classnames('diff-hunk')}>
            {this.judgeAllRowInsertState(chunk.changes)}
          </tbody>
        ))}
      </table>
    );
  }
}
