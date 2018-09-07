import React, { Component } from 'react';
import styled, { injectGlobal } from 'styled-components';
import classnames from 'classnames';

import { rem } from '../utils/common';
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
  display?: string;
}

interface DiffViewProps {
  className?: string;
  fileCopy: File & Diff;
  fileName: string;
  commit: string;
  handleCopy: (chunks: Chunk[]) => boolean;
  getRenderedHunks: (file: File & Diff) => Chunk[];
}

interface DiffViewState {
  tooltipDisplay: string;
}

injectGlobal`
  .diff-gutter-add {
    background-color: rgba(0, 0, 0, .07);
  }

  .diff-gutter-del {
    background-color: rgba(0, 0, 0, .021);
  }

  .diff-code-add {
    font-weight: 700;
    background-color: rgba(0, 0, 0, .07);
  }

  .diff-code-del {
    opacity: 0.3;
    background-color: rgba(0, 0, 0, .07);
  }

`;

const DiffLine = styled.tr`
  line-height: 31px;
  font-family: Consolas, Courier, monospace;
`;

const DiffFile = styled.div`
  color: rgba(0, 0, 0, 0.84);
  display: block;
  /* padding-top: 8px; */
  padding-bottom: 10px;
  background-color: rgba(0, 0, 0, 0.05);
  margin: 32px 0;
`;

const DiffFileHeader = styled.header`
  font-family: Monaco;
  font-size: 14px;
  background-color: black;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  padding: 10px 0px 10px 20px;
  margin-bottom: 16px;
  position: relative;
`;

const Diff = styled.table`
  table-layout: fixed;
  border-collapse: collapse;
  overflow: auto;
  width: 100%;

  td {
    vertical-align: top;
  }
`;

const DiffFileCopyButton = styled.button`
  width: 20px;
  height: 20px;
  float: right;
  margin-right: 20px;
  border: 0px;
  background-color: transparent;
  outline: none;
`;

const DiffCode = styled.td`
  padding: 0 20px;
  overflow: auto;
  width: ${rem(640)}rem;
`;

const DiffGutter = styled.td`
  width: 8px;
  padding: 0 16px;
  color: rgba(0, 0, 0, 0.24);
  &:empty:before {
    content: attr(data-line-number);
  }
`;

const ToolTip = styled.span`
  display: ${(props: ToolTipProps) => props.display};
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
  private nowLineNumber: number;
  private nextAddCount: number;
  constructor(props: DiffViewProps) {
    super(props);
    this.state = {
      tooltipDisplay: 'none',
    };
  }

  renderLineNumber = (
    lineNumberClassName: string,
    lineNumber: number,
  ): React.ReactNode => {
    return (
      <DiffGutter
        className={lineNumberClassName}
        data-line-number={lineNumber}
      />
    );
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
      <DiffLine key={`change${i}`}>
        {this.renderLineNumber(lineNumberClassName, i + 1)}
        <DiffCode className={codeClassName}>
          <Snippet code={content.slice(1)} lang={lang} />
        </DiffCode>
      </DiffLine>
    );
  };

  judgeAllRowInsertState = (changes: Change[] = [], key: number) => {
    // these lines of code are for display correct line number
    if (key === 0) {
      this.nowLineNumber = 0;
    } else {
      this.nowLineNumber = this.nowLineNumber + this.nextAddCount;
    }
    this.nextAddCount = changes.length;

    let isAllInsert = true;
    changes.map((change) => {
      const { type } = change;
      if (type !== 'add') {
        isAllInsert = false;
      }
    });
    return changes.map((change, i) => {
      return this.renderRow(change, isAllInsert, this.nowLineNumber + i);
    });
  };

  showTooltip = () => {
    this.setState({
      tooltipDisplay: 'block',
    });
    this.time = setTimeout(() => {
      this.setState({
        tooltipDisplay: 'none',
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
      <DiffFile>
        <DiffFileHeader>
          {fileName}
          <DiffFileCopyButton
            onClick={(e) => {
              if (handleCopy(getRenderedHunks(fileCopy))) {
                this.showTooltip();
              }
            }}>
            <Icon
              name="icon-clipboard"
              customStyle={{ width: '16px', height: '20px' }}
            />
          </DiffFileCopyButton>
          <ToolTip display={this.state.tooltipDisplay}>复制成功</ToolTip>
        </DiffFileHeader>
        <Diff id={`${commit}-i`}>
          <tbody>
            {chunks.map((chunk: Chunk, key: number) =>
              this.judgeAllRowInsertState(chunk.changes, key),
            )}
          </tbody>
        </Diff>
      </DiffFile>
    );
  }
}
