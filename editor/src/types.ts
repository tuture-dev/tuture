export interface TocArticleItem {
  id: string;
  name: string;
  level: number;
}

export interface TocStepItem extends TocArticleItem {
  number: number;
  articleId?: string;
  outdated?: boolean;
}

export type TocItem = TocArticleItem | TocStepItem;
