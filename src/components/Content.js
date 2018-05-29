import React from 'react';

import { isArray } from './utils/';
import ContentItem from './ContentItem';
import './css/Content.css';



export default class Content extends React.Component {
  renderExplain = (explain) => {
    return (
      isArray(explain)
      ? (explain.map((explainItem, i) => <p key={i}>{explainItem}</p>))
      : <p>{explain}</p>
    );
  }

  render() {
    const { name, explain, diff, commit } = this.props.content;
    return (
      <div className="Content">
        <div className="Content-header">
          <h1>{name}</h1>
          <button
            onClick={this.props.changeViewType}
          >
            {this.props.viewType}
          </button>
        </div>
        {this.renderExplain(explain)}
        <ContentItem
          diff={diff}
          commit={commit}
          viewType={this.props.viewType}
          renderExplain={this.renderExplain}
        />
      </div>
    );
  }
}
