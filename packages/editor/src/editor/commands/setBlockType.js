export default function setBlockType(nodeType, attrs) {
  return function(state, dispatch) {
    let { from, to } = state.selection;
    let applicable = false;
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (applicable) return false;
      if (!node.isTextblock || node.hasMarkup(nodeType, attrs)) return;
      if (node.type == nodeType) {
        applicable = true;
      } else {
        let $pos = state.doc.resolve(pos),
          index = $pos.index();
        applicable = $pos.parent.canReplaceWith(index, index + 1, nodeType);
      }
    });
    if (!applicable) return false;
    if (dispatch)
      dispatch(
        state.tr.setBlockType(from, to, nodeType, attrs).scrollIntoView(),
      );
    return true;
  };
}
