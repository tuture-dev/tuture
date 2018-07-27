import React from 'react';
import styled from 'styled-components';

import ExplainedItem from './ExplainedItem';
import DiffView from './DiffView';

import { LanguageContext } from './App';
import { extractLanguageType } from '../utils/extractors';

import { ChangedFile, File, DiffItem } from '../types';

interface StepDiffProps {
  diff: ChangedFile[];
  commit: string;
  diffItem: DiffItem;
}

interface ResObj {
  [index: string]: ChangedFile[] | File[];
}

/* tslint:disable-next-line */
const Image = styled.img`
  width: 10px;
`;

/* tslint:disable-next-line */
const StepDiffExplain = styled.div`
  font-family: STSongti-SC-Regular;
  font-size: 18px;
  line-height: 1.58;
  margin: 16px 0;
  color: rgba(0, 0, 0, 0.84);
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
    const { diff, diffItem } = this.props;
    const needRenderFiles = this.getEndRenderContent(diff, diffItem.diff);

    return [
      needRenderFiles.map((file: File & ChangedFile, i) => {
        const fileCopy: File & ChangedFile = JSON.parse(JSON.stringify(file));
        const fileName = this.extractFileName(fileCopy);
        const startLine = fileCopy.section ? fileCopy.section.start : 1;
        return (
          <div key={i}>
            <ExplainedItem explain={fileCopy.explain}>
              <article className="diff-file" key={i}>
                <header className="diff-file-header">{fileName}</header>
                <main>
                  <LanguageContext.Provider
                    value={extractLanguageType(fileName)}>
                    <DiffView
                      key={i}
                      hunks={this.getRenderedHunks(fileCopy)}
                      startLine={startLine}
                    />
                  </LanguageContext.Provider>
                </main>
              </article>
            </ExplainedItem>
          </div>
        );
      }),
    ];
  }
}
