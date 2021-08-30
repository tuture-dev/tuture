import { findParentNode } from "tiptap-utils";
import { keymap } from "prosemirror-keymap";
import { TextSelection } from "prosemirror-state";

export default function SelectAllWithinBlockPlugin({ name }) {
  return keymap({
    "Mod-a": (state, dispatch) => {
      const parent = findParentNode((node) => node.type?.name === name)(
        state.selection
      );

      if (!parent) {
        return false;
      }

      const { node, pos, depth } = parent;

      // Compute the depth offset between selected node and wanted parent node
      // to ensure that the parent node will not be deleted when pressing backspace.
      const depthOffset = state.selection.$head.depth - depth;

      const selection = TextSelection.create(
        state.doc,
        pos + depthOffset + 1,
        pos + node.nodeSize - depthOffset - 1
      );

      dispatch(state.tr.setSelection(selection));

      return true;
    },
  });
}
