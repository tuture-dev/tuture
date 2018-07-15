import React, { Component } from 'react';

import Hunk from './Hunk';

import { Hunk as HunkType } from '../../types';

interface DiffViewProps {
  hunks: HunkType[];
}

export default class DiffView extends Component<DiffViewProps> {
  render() {
    const { hunks } = this.props;

    return (
      <table className="diff">
        {hunks.map((hunk: HunkType, key: number) => (
          <Hunk key={key} hunk={hunk} />
        ))}
      </table>
    );
  }
}
