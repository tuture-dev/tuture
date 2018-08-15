import React, { Component } from 'react';
import styled, { injectGlobal } from 'styled-components';
import classnames from 'classnames';

import Snippet from './Snippet';
import { Diff } from '../types';
import Icon from './common/Icon';

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

interface ToolTipProps {
  opacity?: string;
}

interface DiffViewProps {
  startLine: number;
  className?: string;
  fileCopy: File & Diff;
  fileName: string;
  commit: string;
  handleCopy: (chunks: Chunk[]) => boolean;
  getRenderedHunks: (file: File & Diff) => Chunk[];
}

interface DiffViewState {
  tooltipOpacity: string;
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
    /* padding-top: 8px; */
    padding-bottom: 10px;
    background-color: rgba(0, 0, 0, .05);
    margin: 32px 0;
  }

  .diff-file-header {
    font-family: Monaco;
    font-size: 14px;
    background-color: black;
    color: rgba(255,255,255,1);
    text-align: left;
    padding: 10px 0px 10px 20px;
    margin-bottom: 16px;
    position: relative;
  }
  .diff-file-copyButton {
    width: 20px;
    height: 20px;
    float: right;
    margin-right: 20px;
    border: 0px;
    background-color: transparent;
    outline: none;
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

const ToolTip = styled.span`
  opacity: ${(props: ToolTipProps) => props.opacity};
  background-color: black;
  color: #fff;
  text-align: center;
  width: 94px;
  height: 45px;
  line-height: 45px;
  border-radius: 8px;
  position: absolute;
  right: -2.3%;
  bottom: 125%;
  z-index: 1;
  transition: opacity 1s;
  font-family: Georgia, 'Times New Roman', Times, serif;

  &:after {
    content: '';
    position: absolute;
    bottom: -5%;
    right: 37%;
    padding: 10px;
    background-color: inherit;
    border: inherit;
    border-right: 0;
    border-bottom: 0;
    transform: rotate(45deg);
    z-index: -99;
  }
`;

export default class DiffView extends Component<DiffViewProps, DiffViewState> {
  private time: any;
  constructor(props: DiffViewProps) {
    super(props);
    this.state = {
      tooltipOpacity: '0',
    };
  }

  renderLineNumber = (
    lineNumberClassName: string,
    lineNumber: number,
  ): React.ReactNode => {
    return <td className={lineNumberClassName} data-line-number={lineNumber} />;
  };

  renderRow = (change: Change, isAllInsert: Boolean, i: number) => {
    const { type, content } = change;
    const { fileName } = this.props;
    const lang = fileName
      .split('.')
      .pop()
      .toLowerCase();

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
          <Snippet code={content.slice(1)} lang={lang} />
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

  showTooltip = () => {
    this.setState({
      tooltipOpacity: '0.8',
    });
    this.time = setTimeout(() => {
      this.setState({
        tooltipOpacity: '0',
      });
    }, 1000);
  };

  componentWillUnmount() {
    clearTimeout(this.time);
  }

  render() {
    const {
      fileName,
      handleCopy,
      getRenderedHunks,
      fileCopy,
      commit,
    } = this.props;

    const chunks = getRenderedHunks(fileCopy);

    return (
      <div className="diff-file">
        <header className="diff-file-header">
          {fileName}
          <button
            className="diff-file-copyButton"
            onClick={(e) => {
              if (handleCopy(getRenderedHunks(fileCopy))) {
                this.showTooltip();
              }
            }}>
            <Icon
              name="icon-clipboard"
              customStyle={{ width: '16px', height: '20px' }}
            />
          </button>
          <ToolTip opacity={this.state.tooltipOpacity}>复制成功</ToolTip>
        </header>
        <table className="diff" id={`${commit}-i`}>
          {chunks.map((chunk: Chunk, key: number) => (
            <tbody key={key} className={classnames('diff-hunk')}>
              {this.judgeAllRowInsertState(chunk.changes)}
            </tbody>
          ))}
        </table>
      </div>
    );
  }
}
