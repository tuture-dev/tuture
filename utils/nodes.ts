import { PARAGRAPH } from 'editure-constants';
import { Explain } from '../types';

export const emptyChildren = [{ type: PARAGRAPH, children: [{ text: '' }] }];

export const emptyExplain: Explain = {
  type: 'explain',
  fixed: true,
  children: emptyChildren,
};
