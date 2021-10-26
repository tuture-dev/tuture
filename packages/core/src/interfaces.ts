import { DiffFile } from './diff';

export interface IRawDiff {
  commit: string;
  diff: DiffFile[];
}

export interface IMark {
  type: string;
  attrs?: any;
}

export interface IText {
  type: 'text';
  text: string;
  marks?: IMark[];
}

export interface BasicAttrs {
  fixed?: boolean;
  hidden?: boolean;
  outdated?: boolean;
  [attr: string]: any;
}

export interface INode {
  type: string;
  content?: INode[] | IText[];
  attrs?: BasicAttrs;
}

export interface IDiffBlock {
  type: 'diff_block';
  attrs: {
    file: string;
    commit: string;
    hiddenLines?: [number, number][];
  } & BasicAttrs;
}

export interface StepAttrs {
  id: string;
  name: string;
  articleId: string;
  commit: string;
  order: number;
  outdated?: boolean;
}

export interface IHeading {
  type: 'heading';
  content: INode[];
  attrs: {
    id: string;
    level: number;
    step?: StepAttrs;
  } & BasicAttrs;
}

export interface ExplainAttrs {
  level: 'step' | 'file';
  pos: 'pre' | 'post';
  commit: string;
  file?: string;
}

export interface IExplain {
  type: 'explain';
  content: INode[];
  attrs: BasicAttrs & ExplainAttrs;
}

export interface IRemote {
  name: string;
  refs: {
    fetch: string;
    push: string;
  };
}

export interface IMeta {
  name: string;
  description?: string;
  id: string;
  cover?: string;
  created?: Date;
  topics?: string[];
  categories?: string[];
  github?: string;
}

export interface StepMeta {
  id: string;
  commit: string;
}

export interface Article extends IMeta {
  steps: StepMeta[];
}

export interface Collection extends IMeta {
  articles: Article[];
  unassignedSteps: StepMeta[];
  version?: string;
  remotes?: IRemote[];
}

export interface TutureConfig {
  ignoredFiles: string[];
  port: number;
}

export interface Doc {
  type: 'doc';
  content: INode[];
}

export interface StepDoc {
  type: 'doc';
  content: INode[];
  attrs: StepAttrs;
}
