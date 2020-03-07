import * as F from 'editure-constants';

import { FILE, STEP, DIFF_BLOCK } from '../utils/constants';

export function flatten(steps) {
  return steps.flatMap(({ commit, id, articleId, children }) => [
    { commit, id, articleId, type: STEP, children: [{ text: '' }] },
    ...children.flatMap((node) => {
      if (node.type === FILE && node.display) {
        const { file, display } = node;
        return [
          { file, display, commit, type: FILE, children: [{ text: '' }] },
          ...node.children,
        ];
      }
      return node;
    }),
  ]);
}

export function unflatten(fragment) {
  const steps = [{ ...fragment[0], children: [] }];

  for (let i = 1; i < fragment.length; i++) {
    const node = fragment[i];
    if (node.type === STEP) {
      steps.push({ ...node, children: [] });
    } else if (node.type === FILE && node.display) {
      const children = fragment.slice(i + 1, i + 4);

      // If the second child is not a diff block, restore it.
      if (children[1].type !== DIFF_BLOCK) {
        children.splice(1, 0, {
          type: DIFF_BLOCK,
          file: node.file,
          commit: node.commit,
          hiddenLines: [],
        });
        i += 2;
      } else {
        i += 3;
      }

      steps.slice(-1)[0].children.push({ ...node, children });
    } else {
      steps.slice(-1)[0].children.push(node);
    }
  }

  return steps;
}

function isHeading(node) {
  return [F.H1, F.H2, F.H3, F.H4, F.H5].includes(node.type);
}

function getHeadingText(node) {
  return node.children.map((child) => child.text).join('');
}

export function getHeadings(nodes) {
  return nodes.flatMap((node) => {
    if (isHeading(node)) {
      return { ...node, title: getHeadingText(node) };
    }
    if (node.children) {
      return getHeadings(node.children);
    }
    return [];
  });
}

export function getStepTitle(nowStep) {
  const title = getHeadings([nowStep]).filter((node) => node.commit)[0].title;

  return title;
}

export function getNumFromStepId(stepId, steps) {
  const num = steps.findIndex((step) => step.id === stepId);

  return num;
}

export function getArtcleMetaById(articleId = '', articles = []) {
  let targetArticleIndex = 0;
  const targetArticle = articles.filter((article, index) => {
    if (article.id === articleId) {
      targetArticleIndex = index;
      return true;
    }

    return false;
  })[0];

  return {
    articleIndex: targetArticleIndex,
    articleName: targetArticle?.name || '',
  };
}
