// Ported from https://github.com/sergeyt/parse-diff.

export interface DiffFile {
  chunks: Chunk[];
  deletions: number;
  additions: number;
  from?: string;
  to?: string;
  index?: string[];
  deleted?: true;
  new?: true;
}

export interface Chunk {
  content: string;
  changes: Change[];
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
}

export interface NormalChange {
  type: 'normal';
  ln1: number;
  ln2: number;
  normal: true;
  content: string;
}

export interface AddChange {
  type: 'add';
  add: true;
  ln: number;
  content: string;
}

export interface DeleteChange {
  type: 'del';
  del: true;
  ln: number;
  content: string;
}

export type ChangeType = 'normal' | 'add' | 'del';

export type Change = NormalChange | AddChange | DeleteChange;
