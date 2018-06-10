import React, { Component } from 'react';

import Hunk from './Hunk';

export default class DiffView extends Component {
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
          hunks.map((hunk, key) => (
            <Hunk key={key} viewType={viewType} hunk={hunk} />
          ))
        }
      </table>
    );
  }
}
