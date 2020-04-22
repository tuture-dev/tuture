export interface TocArticleItem {
  type: 'article';
  id: string;
  name: string;
  level: number;
}

export interface TocStepItem {
  type: 'step';
  id: string;
  name: string;
  level: number;
  number: number;
  articleId?: string | null;
  outdated?: boolean;
}

export type TocItem = TocArticleItem | TocStepItem;
