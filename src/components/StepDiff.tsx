import React from 'react';
import styled from 'styled-components';

import DiffView from './DiffView';

import { ChangedFile, File, DiffItem } from '../types';
import tutureUtilities from '../utils';

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

interface CollapseObj {
  [index: string]: boolean;
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
    const endRenderContent = diff.map((diffItem) => {
      const fileName = diffItem.file;
      return {
        ...mapedDiff[fileName],
        ...mapedFiles[fileName],
      };
    });

    return endRenderContent;
  };

  getCollapseObj = (arr: ChangedFile[]): CollapseObj => {
    // write a new func for reduce repeat work
    const constructNewCollapseObj: CollapseObj = {};
    if (tutureUtilities.isArray(arr)) {
      arr.map((arrItem) => {
        constructNewCollapseObj[arrItem.file] = arrItem.collapse;
      });
    }

    return constructNewCollapseObj;
  };

  render() {
    const { diff, diffItem } = this.props;
    const collapseObj = this.getCollapseObj(diff);
    const needRenderFiles = this.getEndRenderContent(diff, diffItem.diff);

    return (
      <div className="ContentItem">
        {needRenderFiles.map(
          (file: File & ChangedFile, i) =>
            file &&
            !collapseObj[file.file] && (
              <div key={i}>
                <article className="diff-file" key={i}>
                  <header className="diff-file-header">
                    <strong className="filename">
                      {this.extractFileName(file)}
                    </strong>
                  </header>
                  <main>
                    <DiffView
                      key={i}
                      hunks={file.hunks}
                      viewType={this.props.viewType}
                    />
                  </main>
                </article>
                <div>
                  <div style={{ marginTop: '20px' }}>
                    {this.props.renderExplain(file.explain)}
                  </div>
                </div>
              </div>
            ),
        )}
      </div>
    );
  }
}
