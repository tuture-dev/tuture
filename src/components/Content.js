import React, { Component } from 'react';
import { Button } from 'antd';

import ContentItem from './ContentItem';
import './css/Content.css';



export default class Content extends Component {
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
        <p>{explain}</p>
        <ContentItem 
          diff={diff} 
          commit={commit}
          viewType={this.props.viewType}
        />
      </div>
    );
  }
}
