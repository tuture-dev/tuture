import {
  INode,
  IExplain,
  IHeading,
  IDiffBlock,
  StepAttrs,
  ExplainAttrs,
} from './interfaces.js';
import { randHex } from './utils.js';
import { DiffFile, getHiddenLines } from './diff.js';

export function newStepTitle(content: INode[], attrs: StepAttrs): IHeading {
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

export function newEmptyContent(): INode[] {
  return [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }];
}

export function newEmptyExplain(explainAttrs: ExplainAttrs): IExplain {
  return {
    type: 'explain',
    content: newEmptyContent(),
    attrs: {
      fixed: true,
      ...explainAttrs,
    },
  };
}
