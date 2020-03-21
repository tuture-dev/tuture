import * as F from 'editure-constants';

import {
  FILE,
  STEP,
  DIFF_BLOCK,
  EXPLAIN,
  STEP_END,
  STEP_START,
  FILE_START,
  FILE_END,
} from '../utils/constants';

export function flatten(steps) {
  return steps.flatMap(({ commit, id, articleId, children }) => {
    let stepExplainNumber = 0;

    return [
      {
        type: STEP_START,
        children: [{ text: '' }],
      },
      {
        commit,
        id,
        articleId,
        type: STEP,
        children: [{ text: '' }],
      },
      ...children.flatMap((node) => {
        if (node.type === EXPLAIN) {
          stepExplainNumber = stepExplainNumber + 1;

          if (stepExplainNumber === 1) {
            return { ...node, flag: STEP_START };
          } else if (stepExplainNumber === 2) {
            return { ...node, flag: STEP_END };
          }
        }

        if (node.type === FILE && node.display) {
          const { file, display } = node;

          let fileExplainNumber = 0;
          const explainChildrenWithFlag = node.children.map((nodeItem) => {
            if (nodeItem.type === EXPLAIN) {
              fileExplainNumber = fileExplainNumber + 1;

              if (fileExplainNumber === 1) {
                return { ...nodeItem, flag: FILE_START };
              } else if (fileExplainNumber === 2) {
                return { ...nodeItem, flag: FILE_END };
              }
            }

            return nodeItem;
          });

          return [
            {
              type: FILE_START,
              children: [{ text: '' }],
            },
            {
              file,
              display,
              commit,
              type: FILE,
              children: [{ text: '' }],
            },
            ...explainChildrenWithFlag,
            {
              type: FILE_END,
              children: [{ text: '' }],
            },
          ];
        }

        return node;
      }),
      {
        type: STEP_END,
        children: [{ text: '' }],
      },
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
        break;
      }

      case FILE: {
        if (node.display) {
          step.children.push({ ...node, children: [] });
        } else {
          step.children.push(node);
        }
        break;
      }

      case DIFF_BLOCK: {
        step.children.slice(-1)[0].children.push(node);

        break;
      }

      case EXPLAIN: {
        // In step: step_start || file_end
        if (flag === 'step_start' || flag === 'file_end') {
          step.children.push(node);
        }

        if (flag === 'file_start') {
          step.children.slice(-1)[0].children.push(node);
        }

        break;
      }

      case STEP_START: {
        flag = 'step_start';
        break;
      }

      case STEP_END: {
        flag = 'step_end';
        steps.push(step);

        break;
      }

      case FILE_START: {
        flag = 'file_start';
        break;
      }

      case FILE_END: {
        flag = 'file_end';
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
