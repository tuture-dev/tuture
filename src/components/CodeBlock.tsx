import React from 'react';

import DiffView, { Chunk, File } from './DiffView';
import { Diff } from '../types';
import styled from 'styled-components';

interface CodeBlockProps {
  className?: string;
  handleCopy: (chunks: Chunk[]) => number;
  getRenderedHunks: (file: File & Diff) => Chunk[];
  fileCopy: File & Diff;
  fileName: string;
  startLine: number;
  commit: string;
}

interface CodeBlockState {
  tooltipOpacity: string;
}

interface ToolTipProps {
  opacity: string;
}

const ToolTip = styled.span`
  opacity: ${(props: ToolTipProps) => props.opacity};
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 10px 20px;
  border-radius: 6px;
  position: absolute;
  right: 0;
  bottom: 150%;
  z-index: 1;
  transition: opacity 1s;

  &:after {
    content: '';
    position: absolute;
    bottom: -15%;
    right: 20%;
    padding: 10px;
    background-color: inherit;
    border: inherit;
    border-right: 0;
    border-bottom: 0;
    transform: rotate(45deg);
    z-index: -99;
  }
`;

export default class CodeBlock extends React.Component<
  CodeBlockProps,
  CodeBlockState
> {
  constructor(props: CodeBlockProps) {
    super(props);
    this.state = {
      tooltipOpacity: '0',
    };
  }

  showTooltip = () => {
    console.log(this);
    this.setState({
      tooltipOpacity: '0.8',
    });
    setTimeout(() => {
      this.setState({
        tooltipOpacity: '0',
      });
    }, 1000);
  };

  render() {
    const {
      fileName,
      handleCopy,
      getRenderedHunks,
      fileCopy,
      startLine,
      commit,
    } = this.props;
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
            Copy
          </button>
          <ToolTip opacity={this.state.tooltipOpacity}>复制成功</ToolTip>
        </header>
        <main>
          <DiffView
            id={`${commit}-i`}
            lang={fileName
              .split('.')
              .pop()
              .toLowerCase()}
            chunks={getRenderedHunks(fileCopy)}
            startLine={startLine}
          />
        </main>
      </div>
    );
  }
}
