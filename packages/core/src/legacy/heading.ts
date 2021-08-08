import { Node, Element } from 'editure';

import { Step } from './interfaces.v1';

export interface HeadingItem {
  id: string;
  title: string;
  type: string;
  commit?: string;
}

function isHeading(node: Node) {
  return [
    'heading-one',
    'heading-two',
    'heading-three',
    'heading-four',
    'heading-five',
  ].includes(node.type);
}

function getHeadingText(node: Element) {
  return node.children.map((child) => child.text).join('');
}

export function getHeadings(nodes: Node[]): HeadingItem[] {
  return nodes.flatMap((node) => {
    if (isHeading(node)) {
      return {
        ...(node as Partial<HeadingItem>),
        title: getHeadingText(node as Element),
      } as HeadingItem;
    }
    if (node.children) {
      return getHeadings(node.children);
    }
    return [];
  });
}

export function getStepTitle(nowStep: Step) {
  return getHeadings([nowStep]).filter((node) => node.commit)[0].title;
}
