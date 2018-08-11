import React from 'react';
import styled from 'styled-components';

import ExplainedItem from './ExplainedItem';
import DiffView, { Chunk, File, DiffItem } from './DiffView';
import { Diff } from '../types';
import { reorder } from '../utils/common';

interface StepDiffProps {
  diff: Diff[];
  commit: string;
  diffItem: DiffItem | string;
  isEditMode: boolean;
  updateTutureExplain: (
    commit: string,
    diffKey: string,
    name: 'pre' | 'post',
    value: string,
  ) => void;
  updateTutureDiffOrder: (
    commit: string,
    sourceIndex: number,
    destinationIndex: number,
  ) => void;
}

interface StepDiffState {
  filesToBeRendered: (File & Diff)[];
}

export const DiffWrapper = styled.div`
  padding: ${(props: { isEditMode: boolean }) =>
    props.isEditMode ? '24px' : '0px 24px'};
  &:hover {
    box-shadow: ${(props: { isEditMode: boolean }) =>
      props.isEditMode
        ? '0 1px 4px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(0, 0, 0, 0.09)'
        : 'none'};
    transition: box-shadow 100ms;
  }
`;

/* tslint:disable-next-line */
const InnerList = styled.div``;

const DiffArticle = styled.article`
  color: rgba(0, 0, 0, 0.84);
  display: block;
  padding-top: 8px;
  padding-bottom: 20px;
  background-color: rgba(0, 0, 0, 0.05);
  margin: 32px 0;
`;

const DiffHeader = styled.header`
  font-family: Monaco;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.24);
  text-align: right;
  padding-right: 20px;
`;

export default class StepDiff extends React.PureComponent<
  StepDiffProps,
  StepDiffState
> {
  constructor(props: StepDiffProps) {
    super(props);

    const { diff, diffItem } = this.props;
    const filesToBeRendered = this.getRenderedContent(
      diff,
      (diffItem as DiffItem).diff,
    );
    this.state = {
      filesToBeRendered,
    };
  }

  getRenderedContent = (diff: Diff[], files: File[]): (Diff & File)[] => {
    const filesMap: { [path: string]: File } = {};
    files.forEach((file) => {
      filesMap[file.to] = file;
    });

    return diff.map((item) => {
      const fileName = item.file;
      return {
        ...item,
        ...filesMap[fileName],
      };
    });
  };

  getRenderedHunks = (file: File & Diff) => {
    if (file.section) {
      const changes = file.chunks[0].changes.slice(
        ...[file.section.start - 1, file.section.end],
      );
      file.chunks[0].changes = changes;
    }
    return file.chunks;
  };

  handleCopy = (chunks: Chunk[]) => {
    const contentArr: string[] = [];
    chunks[0].changes.forEach((change) => {
      contentArr.push(change.content.slice(1));
    });
    const needClipedString = contentArr.join('\n');

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.value = needClipedString;
    textarea.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
    }
    document.body.removeChild(textarea);
  };

  render() {
    const { filesToBeRendered } = this.state;
    const { isEditMode, updateTutureExplain, commit } = this.props;

    const renderList = filesToBeRendered.map((file: File & Diff, i) => {
      const fileCopy: File & Diff = JSON.parse(JSON.stringify(file));
      const fileName = fileCopy.file;
      const startLine = fileCopy.section ? fileCopy.section.start : 1;
      return (
        <DiffWrapper isEditMode={isEditMode} key={i}>
          <ExplainedItem
            explain={fileCopy.explain}
            isRoot={false}
            commit={commit}
            diffKey={String(i)}
            updateTutureExplain={updateTutureExplain}
            isEditMode={isEditMode}>
            <article className="diff-file" key={i}>
              <header className="diff-file-header">
                {fileName}
                <button
                  className="diff-file-copyButton"
                  onClick={(e) => {
                    this.handleCopy(this.getRenderedHunks(fileCopy));
                  }}>
                  Copy
                </button>
              </header>
              <main>
                <DiffView
                  key={i}
                  id={`${commit}-i`}
                  lang={fileName
                    .split('.')
                    .pop()
                    .toLowerCase()}
                  chunks={this.getRenderedHunks(fileCopy)}
                  startLine={startLine}
                />
              </main>
            </article>
          </ExplainedItem>
        </DiffWrapper>
      );
    });

    return renderList;
  }
}
