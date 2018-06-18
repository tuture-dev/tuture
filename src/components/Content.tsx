import React from 'react';
import styled from 'styled-components';

import ContentItem from './ContentItem';

import { Step } from '../types/index';

import tutureUtilities from '../utils/';

interface changeViewFunc {
  (): void;
}

interface ContentProps {
  viewType: string;
  changeViewType: changeViewFunc;
  content: Step;
}

const TutureContent = styled.div`
  width: 80%;
  padding: 30px;
  height: 100%;
  overflow-y: scroll;
`;

const TutureContentHeader = styled.div`
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
`;

export default class Content extends React.Component<ContentProps> {
  renderExplain = (explain: string[] | string): React.ReactNode | React.ReactNodeArray => {
    if (tutureUtilities.isArray(explain)) {
      const arrExplain = explain as string[];
      return (
        arrExplain.map((explainItem: string, i: number) =>
          <p key={i}>{explainItem}</p>)
      );
    }

    return <p>{explain}</p>;
  }
  render() {
    const {
      content,
      viewType,
      changeViewType,
    } = this.props;

    const {
      name,
      explain,
      diff,
      commit,
    } = content;

    return (
      <TutureContent>
        <TutureContentHeader>
          <h1>{name}</h1>
          <button onClick={changeViewType}>{viewType}</button>
        </TutureContentHeader>
        {this.renderExplain(explain)}
        <ContentItem
          diff={diff}
          commit={commit}
          viewType={viewType}
          renderExplain={this.renderExplain}
        />
      </TutureContent>
    );
  }
}
