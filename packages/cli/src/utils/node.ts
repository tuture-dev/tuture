import debug from 'debug';
import {
  IText,
  INode,
  IExplain,
  IHeading,
  IDiffBlock,
  ExplainAttrs,
  DiffFile,
  randHex,
  getHiddenLines,
  Collection,
  Article,
  StepAttrs,
  isStepTitle,
} from '@tuture/core';
import { readFileAtCommit } from '@tuture/local-server';

const d = debug('tuture:cli:node');

export function newStepTitle(attrs: StepAttrs, content: IText[]): IHeading {
  return {
    type: 'heading',
    content,

    attrs: {
      id: randHex(8),
      level: 2,
      fixed: true,
      step: attrs,
    },
  };
}

export function newEmptyExplain(explainAttrs: ExplainAttrs): IExplain {
  return {
    type: 'explain',
    content: [{ type: 'paragraph' }],
    attrs: {
      fixed: true,
      ...explainAttrs,
    },
  };
}

export async function newEmptyFile(
  commit: string,
  diffFile: DiffFile,
  hidden: boolean,
): Promise<INode[]> {
  const file = diffFile.to!;
  const diffBlock: IDiffBlock = {
    type: 'diff_block',
    attrs: {
      commit,
      hidden,
      file,
      code: diffFile.deleted ? '' : await readFileAtCommit(commit, file),
      originalCode: diffFile.new
        ? ''
        : await readFileAtCommit(`${commit}~1`, file),
      hiddenLines: getHiddenLines(diffFile),
    },
  };
  d('diffBlock: %o', diffBlock);
  const delimiterAttrs = {
    commit,
    file: diffFile.to!,
  };
  return [
    { type: 'file_start', attrs: delimiterAttrs },
    newEmptyExplain({
      level: 'file',
      pos: 'pre',
      commit,
      file,
    }),
    diffBlock,
    newEmptyExplain({
      level: 'file',
      pos: 'post',
      commit,
      file,
    }),
    { type: 'file_end', attrs: delimiterAttrs },
  ];
}

export function readCommitsFromNodes(nodes: INode[]): string[] {
  return nodes
    .filter((node) => isStepTitle(node))
    .map((node) => node.attrs!.step.commit);
}

export function readArticleMeta(
  collection: Collection,
  articleId: string,
): Article | undefined {
  for (let article of collection.articles) {
    if (article.id === articleId) {
      return article;
    }
  }
  return undefined;
}
