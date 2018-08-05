import React from 'react';
import styled from 'styled-components';

import ExplainedItem from './ExplainedItem';
import DiffView from './DiffView';
import { ChangedFile, File, DiffItem } from '../types';

interface StepDiffProps {
  diff: ChangedFile[];
  commit: string;
  diffItem: DiffItem | string;
  isEditMode: boolean;
}

interface ResObj {
  [index: string]: ChangedFile[] | File[];
}

/* tslint:disable-next-line */
const DiffWrapper = styled.div`
  padding: ${(props: { isEditMode: boolean }) =>
    props.isEditMode ? '1px 24px' : '0px 24px'};
  &:hover {
    box-shadow: ${(props: { isEditMode: boolean }) =>
      props.isEditMode
        ? '0 1px 4px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(0, 0, 0, 0.09)'
        : 'none'};
    transition: box-shadow 100ms;
  }
`;

export default class StepDiff extends React.PureComponent<StepDiffProps> {
  extractFileName({ type, oldPath, newPath }: File): string {
    return type === 'delete' ? oldPath : newPath;
  }

  mapArrItemToObjValue = (property: string, arr: any[]): ResObj => {
    const resObj: ResObj = {};

    if (Array.isArray(arr)) {
      arr.map((item) => {
        resObj[item[property]] = item;
      });
    }

    return resObj;
  };

  getEndRenderContent = (diff: ChangedFile[], files: File[]): any[] => {
    // use fileName key map it belongs obj
    const mapedFiles = this.mapArrItemToObjValue('newPath', files);
    const endRenderContent = diff.map((item) => {
      const fileName = item.file;
      return {
        ...item,
        ...mapedFiles[fileName],
      };
    });

    return endRenderContent;
  };

  getRenderedHunks = (file: File & ChangedFile) => {
    if (file.section) {
      const changes = file.hunks[0].changes.slice(
        ...[file.section.start - 1, file.section.end],
      );
      file.hunks[0].changes = changes;
    }
    return file.hunks;
  };

  render() {
    const { diff, diffItem, isEditMode } = this.props;
    const needRenderFiles = this.getEndRenderContent(
      diff,
      (diffItem as DiffItem).diff,
    );

    return [
      needRenderFiles.map((file: File & ChangedFile, i) => {
        const fileCopy: File & ChangedFile = JSON.parse(JSON.stringify(file));
        const fileName = this.extractFileName(fileCopy);
        const startLine = fileCopy.section ? fileCopy.section.start : 1;
        return (
          <DiffWrapper key={i} isEditMode={isEditMode}>
            <ExplainedItem
              explain={fileCopy.explain}
              isRoot={false}
              isEditMode={isEditMode}>
              <article className="diff-file" key={i}>
                <header className="diff-file-header">{fileName}</header>
                <main>
                  <DiffView
                    key={i}
                    lang={fileName
                      .split('.')
                      .pop()
                      .toLowerCase()}
                    hunks={this.getRenderedHunks(fileCopy)}
                    startLine={startLine}
                  />
                </main>
              </article>
            </ExplainedItem>
          </DiffWrapper>
        );
      }),
    ];
  }
}
