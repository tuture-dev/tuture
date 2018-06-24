import { Change as ChangeType } from '../../types';

function computeOldLineNumber(change: ChangeType): number {
  if (change.isInsert) {
    return -1;
  }

  return change.isNormal ? change.oldLineNumber : change.lineNumber;
}

function computeNewLineNumber(change: ChangeType): number {
  if (change.isDelete) {
    return -1;
  }

  return change.isNormal ? change.newLineNumber : change.lineNumber;
}

function getChangeKey(change: ChangeType): string {
  if (!change) {
    throw new Error('change is not provided');
  }

  const {
    isNormal,
    isInsert,
    lineNumber,
    oldLineNumber,
  } = change;

  if (isNormal) {
    return 'N' + oldLineNumber;
  }

  const prefix = isInsert ? 'I' : 'D';
  return prefix + lineNumber;
}

export {
  computeOldLineNumber,
  computeNewLineNumber,
  getChangeKey,
}
