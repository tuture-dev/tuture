import React, { Component } from 'react';

import Hunk from './Hunk';

import { Hunk as HunkType } from '../../types';

interface DiffViewProps {
  viewType: string;
  hunks: HunkType[];
}

export default class DiffView extends Component<DiffViewProps> {
  render() {
    const { viewType, hunks } = this.props;

    return (
      <table className="diff">
        {hunks.map((hunk: HunkType, key: number) => (
          <Hunk key={key} viewType={viewType} hunk={hunk} />
        ))}
      </table>
    );
  }
}
