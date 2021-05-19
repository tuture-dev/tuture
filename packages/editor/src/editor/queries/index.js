import { findParentNode, findSelectedNodeOfType } from "prosemirror-utils";

export function getColumnIndex(selection) {
  const isColSelection = selection.isColSelection && selection.isColSelection();
  if (!isColSelection) return undefined;

  const path = selection.$from.path;
  return path[path.length - 5];
}

export function getRowIndex(selection) {
  const isRowSelection = selection.isRowSelection && selection.isRowSelection();
  if (!isRowSelection) return undefined;

  const path = selection.$from.path;
  return path[path.length - 8];
}

export function getMarkRange($pos, type) {
  if (!$pos || !type) {
    return false;
  }

  const start = $pos.parent.childAfter($pos.parentOffset);
  if (!start.node) {
    return false;
  }

  const mark = start.node.marks.find((mark) => mark.type === type);
  if (!mark) {
    return false;
  }

  let startIndex = $pos.index();
  let startPos = $pos.start() + start.offset;
  let endIndex = startIndex + 1;
  let endPos = startPos + start.node.nodeSize;

  while (
    startIndex > 0 &&
    mark.isInSet($pos.parent.child(startIndex - 1).marks)
  ) {
    startIndex -= 1;
    startPos -= $pos.parent.child(startIndex).nodeSize;
  }

  while (
    endIndex < $pos.parent.childCount &&
    mark.isInSet($pos.parent.child(endIndex).marks)
  ) {
    endPos += $pos.parent.child(endIndex).nodeSize;
    endIndex += 1;
  }

  return { from: startPos, to: endPos, mark };
}

export const isMarkActive = (type) => (state) => {
  const { from, $from, to, empty } = state.selection;

  return empty
    ? type.isInSet(state.storedMarks || $from.marks())
    : state.doc.rangeHasMark(from, to, type);
};

export const isNodeActive = (type, attrs = {}) => (state) => {
  const node =
    findSelectedNodeOfType(type)(state.selection) ||
    findParentNode((node) => node.type === type)(state.selection);

  if (!Object.keys(attrs).length || !node) {
    return !!node;
  }

  return node.node.hasMarkup(type, { ...node.node.attrs, ...attrs });
};

export function isInCode(state) {
  const $head = state.selection.$head;
  for (let d = $head.depth; d > 0; d--) {
    if ($head.node(d).type === state.schema.nodes.code_block) {
      return true;
    }
  }

  return isMarkActive(state.schema.marks.code_inline)(state);
}

export function isList(node, schema) {
  return (
    node.type === schema.nodes.bullet_list ||
    node.type === schema.nodes.ordered_list ||
    node.type === schema.nodes.todo_list
  );
}

export function isInList(state) {
  const $head = state.selection.$head;
  for (let d = $head.depth; d > 0; d--) {
    if (
      ["ordered_list", "bullet_list", "todo_list"].includes(
        $head.node(d).type.name
      )
    ) {
      return true;
    }
  }

  return false;
}
