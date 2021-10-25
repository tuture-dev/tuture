import {
  findWrapping,
  canSplit,
  ReplaceAroundStep,
} from 'prosemirror-transform';
import { Slice, Fragment, NodeRange } from 'prosemirror-model';

// 兼容 tiptap2 的 command 设计，为了后续可以扩展链式命令调用
export const wrapInList = (listType, attrs = {}) => ({ state, dispatch }) => {
  return originalWrapInList(listType, attrs)(state, dispatch);
};

// :: (NodeType, ?Object) → (state: EditorState, dispatch: ?(tr: Transaction)) → bool
// Returns a command function that wraps the selection in a list with
// the given type an attributes. If `dispatch` is null, only return a
// value to indicate whether this is possible, but don't actually
// perform the change.
export function originalWrapInList(listType, attrs) {
  return function(state, dispatch) {
    let { $from, $to } = state.selection;
    let range = $from.blockRange($to),
      doJoin = false,
      outerRange = range;
    if (!range) return false;
    // This is at the top of an existing list item
    if (
      range.depth >= 2 &&
      $from.node(range.depth - 1).type.compatibleContent(listType) &&
      range.startIndex == 0
    ) {
      // Don't do anything if this is the top of the list
      if ($from.index(range.depth - 1) == 0) return false;
      let $insert = state.doc.resolve(range.start - 2);
      outerRange = new NodeRange($insert, $insert, range.depth);
      if (range.endIndex < range.parent.childCount)
        range = new NodeRange(
          $from,
          state.doc.resolve($to.end(range.depth)),
          range.depth,
        );
      doJoin = true;
    }
    let wrap = findWrapping(outerRange, listType, attrs, range);
    if (!wrap) return false;
    if (dispatch) {
      dispatch(
        doWrapInList(state.tr, range, wrap, doJoin, listType).scrollIntoView(),
      );
    }
    return true;
  };
}

function doWrapInList(tr, range, wrappers, joinBefore, listType) {
  let content = Fragment.empty;
  for (let i = wrappers.length - 1; i >= 0; i--)
    content = Fragment.from(
      wrappers[i].type.create(wrappers[i].attrs, content),
    );

  tr.step(
    new ReplaceAroundStep(
      range.start - (joinBefore ? 2 : 0),
      range.end,
      range.start,
      range.end,
      new Slice(content, 0, 0),
      wrappers.length,
      true,
    ),
  );

  let found = 0;
  for (let i = 0; i < wrappers.length; i++)
    if (wrappers[i].type == listType) found = i + 1;
  let splitDepth = wrappers.length - found;

  let splitPos = range.start + wrappers.length - (joinBefore ? 2 : 0),
    parent = range.parent;
  for (
    let i = range.startIndex, e = range.endIndex, first = true;
    i < e;
    i++, first = false
  ) {
    if (!first && canSplit(tr.doc, splitPos, splitDepth)) {
      tr.split(splitPos, splitDepth);
      splitPos += 2 * splitDepth;
    }
    splitPos += parent.child(i).nodeSize;
  }
  return tr;
}
