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
} from '@tuture/core';

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
  const delimiterAttrs = {
    commit,
    file: file.to!,
  };
  return [
    { type: 'file_start', attrs: delimiterAttrs },
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
    { type: 'file_end', attrs: delimiterAttrs },
  ];
}

export function isStepTitle(node: INode): boolean {
  return node.type === 'heading' && node.attrs!.step;
}

export function isText(node: INode): node is IText {
  return node.type === 'text';
}

export function getNodeText(node: INode): string {
  return isText(node)
    ? node.text
    : (node.content! as INode[]).map((child) => getNodeText(child)).join();
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
