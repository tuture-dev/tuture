import debug from 'debug';
import { isBinaryFile } from 'isbinaryfile';
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
} from '@tuture/core';
import { readFileAtCommit } from '@tuture/local-server';

const d = debug('tuture:cli:node');

export function newStepTitle(commit: string, content: IText[]): IHeading {
  return {
    type: 'heading',
    content,

    attrs: {
      id: randHex(8),
      level: 2,
      fixed: true,
      commit,
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
  // TODO: handle delete case (the file no longer exists!)
  const file = diffFile.to!;
  const diffBlock: IDiffBlock = {
    type: 'diff_block',
    content: [],
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

  if (await isBinaryFile(file)) {
    // Binary files are hidden by default.
    diffBlock.attrs.hidden = true;
  } else {
    const code = diffFile.deleted
      ? ''
      : (await readFileAtCommit(commit, file)) || '';
    const originalCode = diffFile.new
      ? ''
      : (await readFileAtCommit(`${commit}~1`, file)) || '';

    // Skip files with too lengthy diff
    // TODO: Add it to the config
    if (code.length <= 10000 || originalCode.length <= 10000) {
      // If not binary, try reading diff.
      diffBlock.attrs.code = code;
      diffBlock.attrs.originalCode = originalCode;
    }
  }

  d('diffBlock: %o', diffBlock);
  const delimiterAttrs = {
    commit,
    file: diffFile.to!,
  };
  return [
    { type: 'file_start', attrs: delimiterAttrs, content: [] },
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
    { type: 'file_end', attrs: delimiterAttrs, content: [] },
  ];
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
