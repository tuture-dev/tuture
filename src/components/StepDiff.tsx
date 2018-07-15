import React from 'react';
import styled from 'styled-components';

import DiffView from './DiffView';
import { LanguageContext } from './App';
import { extractLanguageType } from '../utils/extractors';

import { ChangedFile, File, DiffItem } from '../types';

interface RenderExplainFunc {
  (explain: string | string[]): React.ReactNode | React.ReactNodeArray;
}

interface StepDiffProps {
  diff: ChangedFile[];
  commit: string;
  diffItem: DiffItem;
  renderExplain: RenderExplainFunc;
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
  font-size: 21px;
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
    const mapedDiff = this.mapArrItemToObjValue('file', diff);
    const endRenderContent = diff.map((item) => {
      const fileName = item.file;
      return {
        ...mapedDiff[fileName],
        ...mapedFiles[fileName],
      };
    });

    return endRenderContent;
  };

  render() {
    const { diff, diffItem, renderExplain } = this.props;
    const needRenderFiles = this.getEndRenderContent(diff, diffItem.diff);

    return [
      needRenderFiles.map((file: File & ChangedFile, i) => {
        const fileName = this.extractFileName(file);
        return (
          <div key={i}>
            <article className="diff-file" key={i}>
              <header className="diff-file-header">{fileName}</header>
              <main>
                <LanguageContext.Provider value={extractLanguageType(fileName)}>
                  <DiffView key={i} hunks={file.hunks} />
                </LanguageContext.Provider>
              </main>
            </article>
            {renderExplain(file.explain)}
          </div>
        );
      }),
    ];
  }
}
