import React, { Component } from 'react';

import UnifiedHunk from './UnifiedHunk';
import SplitHunk from './SplitHunk';

import './css/Change.css';

export default class Hunk extends Component {
  render() {
    const { viewType, hunk } = this.props;
    const RenderingHunk = viewType === 'unified' ? UnifiedHunk : SplitHunk;

    return (
      <RenderingHunk
        hunk={hunk}
      />
    );
  }
}
