import * as F from 'editure-constants';

import { FILE, STEP, DIFF_BLOCK, EXPLAIN } from '../utils/constants';

export function flatten(steps) {
  return steps.flatMap(({ commit, id, articleId, children }) => {
    let stepExplainNumber = 0;

    return [
      {
        commit,
        id,
        articleId,
        type: STEP,
        children: [{ text: '' }],
        flag: 'step_start',
      },
      ...children.flatMap((node) => {
        if (node.type === EXPLAIN) {
          stepExplainNumber = stepExplainNumber + 1;
        }

        if (node.type === FILE && node.display) {
          const { file, display } = node;
          const fileChildren = node.children.map((nodeItem, index) => {
            if (index === node.children.length - 1) {
              return { ...nodeItem, flag: 'file_end' };
            }

            return nodeItem;
          });

          return [
            {
              file,
              display,
              commit,
              type: FILE,
              children: [{ text: '' }],
              flag: 'file_start',
            },
            ...fileChildren,
          ];
        }

        if (stepExplainNumber === 2) {
          return { ...node, flag: 'step_end' };
        }

        return node;
      }),
    ];
  });
}

export function unflatten(fragment) {
  const steps = [];

  let step = { children: [] };
  let flag = '';
  for (let i = 0; i < fragment.length; i++) {
    const node = fragment[i];

    switch (node.type) {
      case STEP: {
        step = { ...node, children: [] };
        flag = node.flag;
        break;
      }

      case FILE: {
        if (node.display) {
          step.children.push({ ...node, children: [] });
        } else {
          step.children.push(node);
        }

        flag = node.flag;
        break;
      }

      case DIFF_BLOCK: {
        step.children.slice(-1)[0].children.push(node);

        break;
      }

      case EXPLAIN: {
        if (node.flag) {
          flag = node.flag;
        }

        if (flag === 'step_start' || flag === 'step_end') {
          step.children.push(node);
        }

        if (flag === 'file_start' || flag === 'file_end') {
          step.children.slice(-1)[0].children.push(node);
        }

        if (flag === 'step_end') {
          steps.push(step);
        }

        break;
      }

      default: {
        step.children.push(node);
      }
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
