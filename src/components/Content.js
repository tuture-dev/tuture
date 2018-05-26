import React, { Component } from 'react';
import { Button } from 'antd';

import { isArray } from './utils/';
import ContentItem from './ContentItem';
import './css/Content.css';



export default class Content extends Component {
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
          <Button
            type="primary"
            onClick={this.props.changeViewType}
          >
            {this.props.viewType}
          </Button>
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
