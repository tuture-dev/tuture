import React from 'react';
import styled from 'styled-components';
import isEqual from 'lodash.isequal';
import { inject, observer } from 'mobx-react';

import ExplainedItem from './ExplainedItem';
import DiffView, { Chunk, File, DiffItem } from './DiffView';
import { Diff } from '../types';
import Store from './store';

interface StepDiffProps {
  diff: Diff[];
  commit: string;
  diffItem: DiffItem | string;
  index: number;
  store?: Store;
}

interface StepDiffState {
  filesToBeRendered: (File & Diff)[];
}

export const DiffWrapper = styled.div`
  margin-top: 12px;
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

@inject('store')
@observer
export default class StepDiff extends React.Component<
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

  componentWillReceiveProps(nextProps: StepDiffProps) {
    const { diff, diffItem } = nextProps;
    const filesToBeRendered = this.getRenderedContent(
      diff,
      (diffItem as DiffItem).diff,
    );
    if (!isEqual(diff, this.props.diff)) {
      this.setState({ filesToBeRendered });
    }
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

  handleCopy = (chunks: Chunk[]): boolean => {
    let res = false;
    const contentArr: string[] = [];
    chunks[0].changes.forEach((change) => {
      if (change.type === 'del') {
        return;
      }
      contentArr.push(change.content.slice(1));
    });
    const needClipedString = contentArr.join('\n');
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.value = needClipedString;
    textarea.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      res = true;
    }
    document.body.removeChild(textarea);
    return res;
  };

  render() {
    const { filesToBeRendered } = this.state;
    const { commit, store } = this.props;

    const renderList = filesToBeRendered.map((file: File & Diff, i: number) => {
      // if file display is false or not exists, then not display it
      if (!file.display) {
        return;
      }
      const fileCopy: File & Diff = file;
      const fileName = fileCopy.file;
      return (
        <DiffWrapper isEditMode={store.isEditMode} key={i}>
          <ExplainedItem
            explain={fileCopy.explain}
            isRoot={false}
            commit={commit}
            diffKey={String(i)}>
            <DiffView
              className="diff-file"
              handleCopy={this.handleCopy}
              getRenderedHunks={this.getRenderedHunks}
              fileCopy={fileCopy}
              fileName={fileName}
              commit={commit}
            />
          </ExplainedItem>
        </DiffWrapper>
      );
    });

    return renderList;
  }
}
