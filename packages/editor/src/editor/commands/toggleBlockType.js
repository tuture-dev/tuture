// import { setBlockType } from "prosemirror-commands";
import { nodeIsActive } from 'tiptap-utils';
import { clearNodes, setBlockType } from '../commands';
import { createChainableState } from '../helpers';

export default function(type, toggletype, attrs = {}) {
  return (state, dispatch, view) => {
    const isActive = nodeIsActive(state, type, attrs);

    if (isActive) {
      return setBlockType(toggletype)(state, dispatch, view);
    }

    // 判断此时选中的 range 是否可以进行 wrapInList 操作
    const canSetToogleType = setBlockType(type)(state, null);
    if (!canSetToogleType) {
      const tr = state.tr;

      const props = {
        tr,
        view,
        state: createChainableState({
          state,
          transaction: tr,
        }),
        dispatch: () => undefined,
      };

      clearNodes()(props);
      view.dispatch(tr);
      view.focus();

      return setBlockType(type, attrs)(view.state, dispatch);
    }

    return setBlockType(type, attrs)(state, dispatch, view);
  };
}
