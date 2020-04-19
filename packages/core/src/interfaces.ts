import { Element } from 'tuture-slate';

import { DiffFile } from './diff';

export interface RawDiff {
  commit: string;
  diff: DiffFile[];
}

export interface Explain extends Element {
  type: 'explain';
  fixed: true;
}

export interface DiffBlock extends Element {
  type: 'diff-block';
  file: string;
  commit: string;
  hiddenLines?: [number, number][];
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

export type StepChild = StepTitle | Explain | File;

export interface Step extends Element {
  type: 'step';
  id: string;
  articleId?: string | null;
  outdated?: boolean;
  commit: string;
  children: StepChild[];
}

export interface Remote {
  name: string;
  refs: {
    fetch: string;
    push: string;
  };
}

export interface Collection extends Meta {
  version?: string;
  articles: Article[];
  remotes?: Remote[];
  steps: Step[];
}

export interface TutureConfig {
  ignoredFiles: string[];
  port: number;
}
