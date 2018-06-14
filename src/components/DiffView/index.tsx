import React, { Component } from 'react';

import Hunk from './Hunk';

import { Hunk as HunkType } from '../ContentItem';

interface DiffViewProps {
  viewType: string;
  hunks: HunkType[];
}

export default class DiffView extends Component<DiffViewProps> {
  render() {
    const { viewType, hunks } = this.props;

    const gutterContent = (
      viewType === 'unified'
      ? (
        <colgroup>
          <col className="diff-gutter-col"/>
          <col className="diff-gutter-col"/>
        </colgroup>
      ) : (
        <colgroup>
          <col className="diff-gutter-col"/>
          <col/>
          <col className="diff-gutter-col"/>
          <col/>
        </colgroup>
      )
    )

    return (
      <table className="diff">
        {gutterContent}
        {
          hunks.map((hunk: HunkType, key: number) => (
            <Hunk key={key} viewType={viewType} hunk={hunk} />
          ))
        }
      </table>
    );
  }
}
