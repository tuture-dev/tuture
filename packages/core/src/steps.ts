import omit from 'lodash.omit';
import { Node } from 'tuture-slate';

import { Step, File, DiffBlock, Explain } from './interfaces';

export const STEP_START = 'step_start';
export const STEP_END = 'step_end';
export const FILE_START = 'file_start';
export const FILE_END = 'file_end';
export const NOW_STEP_START = 'now_step_start';

export function flattenSteps(steps: Step[]): Node[] {
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
        type: 'step',
        children: [{ text: '' }],
      },
      ...children.flatMap((node) => {
        if (node.type === 'explain') {
          stepExplainNumber = stepExplainNumber + 1;

          if (stepExplainNumber === 1) {
            return { ...node, flag: STEP_START };
          } else if (stepExplainNumber === 2) {
            return { ...node, flag: STEP_END };
          }
        }

        if (node.type === 'file' && node.display) {
          const { file, display } = node;

          let fileExplainNumber = 0;
          const explainChildrenWithFlag = node.children.map((nodeItem: any) => {
            if (nodeItem.type === 'explain') {
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
              type: 'file',
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

export function unflattenSteps(fragment: Node[]) {
  const steps = [];

  let step: Partial<Step> = { children: [] };
  let flag = '';
  for (let i = 0; i < fragment.length; i++) {
    const node = fragment[i];

    switch (node.type) {
      case 'step': {
        step = { ...node, children: [] };
        break;
      }

      case 'file': {
        if (node.display) {
          step.children!.push({ ...node, children: [] } as any);
        } else {
          step.children!.push(node as File);
        }
        break;
      }

      case 'diff-block': {
        step.children!.slice(-1)[0].children.push(node as DiffBlock);

        break;
      }

      case 'explain': {
        // In step: step_start || file_end
        if (flag === 'step_start' || flag === 'file_end') {
          step.children!.push(omit(node, 'flag') as Explain);
        }

        if (flag === 'file_start') {
          step
            .children!.slice(-1)[0]
            .children.push(omit(node, 'flag') as Explain);
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
        step.children!.push(node as any);
      }
    }
  }

  return steps as Step[];
}
