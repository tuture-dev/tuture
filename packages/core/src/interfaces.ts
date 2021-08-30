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

export interface StepTitleAttrs {
  commit: string;
}

export interface IHeading {
  type: 'heading';
  content: INode[];
  attrs: {
    id: string;
    level: number;
    step?: StepTitleAttrs;
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

export interface Article extends IMeta {}

export interface Collection extends IMeta {
  version?: string;
  articles: Article[];
  remotes?: IRemote[];
}

export interface TutureConfig {
  ignoredFiles: string[];
  port: number;
}
