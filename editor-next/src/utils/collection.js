import * as F from 'editure-constants';
import { FILE, STEP } from '../utils/constants';

export function flatten(steps) {
  return steps.flatMap(({ commit, id, children }) => [
    { commit, id, type: STEP, children: [{ text: '' }] },
    ...children.flatMap((node) => {
      if (node.type === FILE && node.display) {
        const { file, display } = node;
        return [
          { file, display, type: FILE, children: [{ text: '' }] },
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
      steps
        .slice(-1)[0]
        .children.push({ ...node, children: fragment.slice(i + 1, i + 4) });
      i += 3;
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
