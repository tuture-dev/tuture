import { Article } from '@tuture/core';

export interface TocArticleItem extends Article {
  type: 'article';
}

export interface TocStepItem {
  type: 'step';
  id: string;
  name: string;
  number: number;
  articleId?: string | null;
  outdated?: boolean;
}

export type TocItem = TocArticleItem | TocStepItem;

export interface CollectionStep {
  key: string;
  id: string;
  title: string;
  articleId?: string | null;
  articleIndex: number;
  articleName: string;
}
