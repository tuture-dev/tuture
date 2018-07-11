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
  viewType: string;
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
    const { diff, diffItem, viewType } = this.props;
    const needRenderFiles = this.getEndRenderContent(diff, diffItem.diff);

    return (
      <div className="ContentItem">
        {needRenderFiles.map((file: File & ChangedFile, i) => {
          const fileName = this.extractFileName(file);
          return (
            <div key={i}>
              <article className="diff-file" key={i}>
                <header className="diff-file-header">
                  <strong className="filename">{fileName}</strong>
                </header>
                <main>
                  <LanguageContext.Provider
                    value={extractLanguageType(fileName)}>
                    <DiffView key={i} hunks={file.hunks} viewType={viewType} />
                  </LanguageContext.Provider>
                </main>
              </article>
              <div>
                <div style={{ marginTop: '20px' }}>
                  {this.props.renderExplain(file.explain)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
