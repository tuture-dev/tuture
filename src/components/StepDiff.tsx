import React from 'react';
import styled from 'styled-components';

import DiffView from './DiffView';

import { ChangedFile, File, DiffItem } from '../types';
import tutureUtilities from '../utils';

import up from './img/up.svg';
import down from './img/down.svg';

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

interface StepDiffState {
  collapseObj: CollapseObj;
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

export default class StepDiff extends React.PureComponent<
  StepDiffProps,
  StepDiffState
> {
  constructor(props: StepDiffProps) {
    super(props);
    this.state = {
      collapseObj: {},
    };
  }
  componentDidMount(): void {
    const { diff } = this.props;

    // construct collapsed arr
    const newCollapseObj = this.getCollapseObj(diff);
    this.setState({
      collapseObj: newCollapseObj,
    });
  }

  componentWillReceiveProps(nextProps: StepDiffProps): void {
    if (nextProps.diff !== this.props.diff) {
      const newCollapseObj = this.getCollapseObj(nextProps.diff);
      this.setState({
        collapseObj: newCollapseObj,
      });
    }
  }
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

  renderIcon = (type: string): React.ReactNode => {
    const mapTypeToSvg: {
      [index: string]: string;
    } = {
      up,
      down,
    };

    return <Image src={mapTypeToSvg[type]} />;
  };

  toggleCollapse = (fileName: string): void => {
    console.log(fileName);
    const { collapseObj } = this.state;
    const newCollapseObj = {
      ...collapseObj,
      [fileName]: !collapseObj[fileName],
    };

    this.setState({
      collapseObj: newCollapseObj,
    });
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
    const { collapseObj } = this.state;
    const needRenderFiles = this.getEndRenderContent(diff, diffItem.diff);

    return (
      <div className="ContentItem">
        {needRenderFiles.map((file: File & ChangedFile, i) => (
          <div key={i}>
            <article className="diff-file" key={i}>
              <header className="diff-file-header">
                <strong className="filename">
                  {this.extractFileName(file)}
                </strong>
                <button onClick={() => this.toggleCollapse(file.file)}>
                  {this.renderIcon(collapseObj[file.file] ? 'up' : 'down')}
                </button>
              </header>
              <main>
                {file &&
                  !collapseObj[file.file] && (
                    <DiffView
                      key={i}
                      hunks={file.hunks}
                      viewType={this.props.viewType}
                    />
                  )}
              </main>
            </article>
            <div>
              <div style={{ marginTop: '20px' }}>
                {this.props.renderExplain(file.explain)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
