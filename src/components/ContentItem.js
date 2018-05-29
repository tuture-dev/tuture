import React, { Component } from 'react';
import { property, union, isArray } from 'lodash/fp';
import { Input, Button, Icon } from 'antd';
import { parseDiff, Diff, HunkHeader } from 'react-diff-view';

import './css/ContentItem.css';
import './css/Hunk.css';
import './css/Change.css';
import './css/Diff.css';


export default class ContentItem extends Component {
  state = {
    diffText: '',
    collapseObj: {},
    diff: [],
    files: [],
  };

  async setDiffAndFiles(commit, diff) {
    const that = this;
    const response = await fetch(`diff/${commit}.diff`);
    const diffText = await response.text();
    let files = [];

    if (diffText) {
      files = parseDiff(diffText);
    }

    that.setState({
      files,
      diff,
    });
  }

  getCollapseObj = (arr) => {
    // write a new func for reduce repeat work
    let constructNewCollapseObj = {};
    if (isArray(arr)) {
      arr.map(arrItem => {
        constructNewCollapseObj[arrItem.file] = arrItem.collapse;
      });
    }

    return constructNewCollapseObj;
  }

  componentDidMount() {
    const { commit, diff } = this.props;
    this.setDiffAndFiles(commit, diff);

    // construct collapsed arr
    const newCollapseObj = this.getCollapseObj(diff);
    this.setState({
      collapseObj: newCollapseObj,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.commit !== this.props.commit) {
      this.setDiffAndFiles(nextProps.commit, nextProps.diff);
    }

    if (nextProps.diff !== this.props.diff) {
      const newCollapseObj = this.getCollapseObj(nextProps.diff);
      this.setState({
        collapseObj: newCollapseObj,
      });
    }
  }

  extractFileName({ type, oldPath, newPath }) {
    return type === 'delete' ? oldPath : newPath;
  }

  mapArrItemToObjValue = (property, arr) => {
    let resObj = {};

    if (Array.isArray(arr)) {
      arr.map(item => {
        resObj[item[property]] = item;
      });
    }

    return resObj;
  }

  getEndRenderContent = (diff, files) => {
    // use fileName key map it belongs obj
    const mapedFiles = this.mapArrItemToObjValue('newPath', files);
    const mapedDiff = this.mapArrItemToObjValue('file', diff);
    const endRenderContent = diff.map(diffItem => {
      const fileName = diffItem.file;
      return {
        ...mapedDiff[fileName],
        ...mapedFiles[fileName],
      };
    });

    return endRenderContent;
  }

  toggleCollapse = (fileName) => {
    const { collapseObj } = this.state;
    const newCollapseObj = { ...collapseObj, [fileName]: !collapseObj[fileName] };

    this.setState({
      collapseObj: newCollapseObj,
    });
  }

  render() {
    const { files, diff, collapseObj } = this.state;
    const needRenderFiles = this.getEndRenderContent(diff, files);

    return (
      <div className="ContentItem">
        {
          needRenderFiles.map((file, i) => (
            <div key={i}>
              <article className="diff-file" key={i}>
                <header className="diff-file-header">
                    <strong className="filename">{this.extractFileName(file)}</strong>
                    <Button
                      onClick={() => this.toggleCollapse(file.file)}
                    >
                    {<Icon type={collapseObj[file.file] ? 'up' : 'down'} />}
                    </Button>
                </header>
                <main>
                  {
                    file && !collapseObj[file.file] && (
                      <Diff key={i} hunks={file.hunks} viewType={this.props.viewType} />
                    )
                  }
                </main>
              </article>
              <div>
                <div style={{ marginTop: '20px' }}>
                  {
                    this.props.renderExplain(file.explain)
                  }
                </div>
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}
