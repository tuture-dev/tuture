import * as F from 'editure-constants';
import { Node, Element } from 'editure';
import { Article, Step } from '@tuture/core';

import { HeadingItem } from '../types';

function isHeading(node: Node) {
  return [F.H1, F.H2, F.H3, F.H4, F.H5].includes(node.type);
}

function getHeadingText(node: Element) {
  return node.children.map((child) => child.text).join('');
}

export function getHeadings(nodes: Node[]): HeadingItem[] {
  return nodes.flatMap((node) => {
    if (isHeading(node)) {
      return {
        ...(node as Partial<HeadingItem>),
        title: getHeadingText(node as Element),
      } as HeadingItem;
    }
    if (node.children) {
      return getHeadings(node.children);
    }
    return [];
  });
}

export function getStepTitle(nowStep: Step) {
  return getHeadings([nowStep]).filter((node) => node.commit)[0].title;
}

export function getNumFromStepId(stepId: string, steps: Step[]) {
  return steps.findIndex((step) => step.id === stepId);
}

export function getArtcleMetaById(articleId = '', articles: Article[] = []) {
  let targetArticleIndex = 0;
  const targetArticle = articles.filter((article, index) => {
    if (article.id === articleId) {
      targetArticleIndex = index;
      return true;
    }
    return false;
  })[0];

  return {
    articleIndex: targetArticleIndex,
    articleName: targetArticle?.name || '',
  };
}
