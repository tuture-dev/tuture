import {
  IText,
  INode,
  IExplain,
  IHeading,
  IDiffBlock,
  ExplainAttrs,
} from './interfaces';
import { randHex } from './utils';
import { DiffFile, getHiddenLines } from './diff';

export function newStepTitle(hash: string, content: INode[]): IHeading {
  return {
    type: 'heading',
    content,
    attrs: {
      id: randHex(8),
      level: 2,
      fixed: true,
      step: { commit: hash },
    },
  };
}

export function newEmptyContent(): INode[] {
  return [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }];
}

export function newEmptyExplain(explainAttrs: ExplainAttrs): IExplain {
  return {
    type: 'explain',
    content: newEmptyContent(),
    attrs: {
      fixed: true,
      ...explainAttrs,
    },
  };
}

export function newEmptyFile(
  commit: string,
  file: DiffFile,
  hidden: boolean,
): INode[] {
  const diffBlock: IDiffBlock = {
    type: 'diff_block',
    attrs: {
      commit,
      hidden,
      file: file.to!,
      hiddenLines: getHiddenLines(file),
    },
  };
  return [
    newEmptyExplain({
      level: 'file',
      pos: 'pre',
      commit,
      file: file.to!,
    }),
    diffBlock,
    newEmptyExplain({
      level: 'file',
      pos: 'post',
      commit,
      file: file.to!,
    }),
  ];
}
