import { DiffFile } from './diff.js';

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
  content?: INode[] | IText[];
  attrs: {
    file: string;
    commit: string;
    code: string;
    originalCode: string;
    hiddenLines?: [number, number][];
  } & BasicAttrs;
}

export interface IHeading {
  type: 'heading';
  content: INode[];
  attrs: {
    id: string;
    level: number;
    commit?: string;
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

export interface Article extends IMeta {}

export interface Collection extends IMeta {
  articles: Article[];
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
