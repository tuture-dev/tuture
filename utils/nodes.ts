import { Explain } from '../types';

export const emptyChildren = [{ type: 'paragraph', children: [{ text: '' }] }];

export const emptyExplain: Explain = {
  type: 'explain',
  fixed: true,
  children: emptyChildren,
};
