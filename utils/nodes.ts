import { Element } from 'slate';
import { PARAGRAPH } from 'editure-constants';
import { Explain } from '../types';

export function getEmptyChildren(): Element[] {
  return [{ type: PARAGRAPH, children: [{ text: '' }] }];
}

export function getEmptyExplain(): Explain {
  return {
    type: 'explain',
    fixed: true,
    children: getEmptyChildren(),
  };
}
