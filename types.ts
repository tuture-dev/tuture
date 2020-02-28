import { Element } from 'slate';

export interface Explain extends Element {
  type: 'explain';
  fixed: true;
}

export interface DiffBlock extends Element {
  type: 'diff-block';
  file: string;
  commit: string;
  hiddenLines?: Array<number>;
}

export interface File extends Element {
  type: 'file';
  file: string;
  display?: boolean;
  children: [Explain, DiffBlock, Explain];
}

export interface Meta {
  name: string;
  description?: string;
  id: string;
  cover?: string;
  created?: Date;
  topics?: string[];
  categories?: string[];
  github?: string;
}

export interface Article extends Meta {}

export interface StepTitle extends Element {
  type: 'heading-two';
  commit: string;
  id: string;
  fixed: true;
}

export interface Step extends Element {
  type: 'step';
  id: string;
  articleId?: string | null;
  outdated?: boolean;
  commit: string;
  children: Array<StepTitle | Explain | File>;
}

export interface Collection extends Meta {
  articles: Article[];
  steps: Step[];
}

export interface TutureConfig {
  ignoredFiles: string[];
  port: number;
}
