import { liftListItem } from 'prosemirror-schema-list';
import { findParentNode } from 'prosemirror-utils';
import { clearNodes, wrapInList } from '../commands';
import createChainableState from '../helpers/createChainableState';

export function isList(node, schema) {
  return (
    node.type === schema.nodes.bullet_list ||
    node.type === schema.nodes.ordered_list ||
    node.type === schema.nodes.todo_list
  );
}

export default function toggleList(listType, itemType) {
  return (state, dispatch, view) => {
    const { schema, selection } = state;
    const { $from, $to } = selection;
    const range = $from.blockRange($to);

    if (!range) {
      return false;
    }

    const parentList = findParentNode((node) => isList(node, schema))(
      selection,
    );

    if (range.depth >= 1 && parentList && range.depth - parentList.depth <= 1) {
      if (parentList.node.type === listType) {
        return liftListItem(itemType)(state, dispatch, view);
      }

      if (
        isList(parentList.node, schema) &&
        listType.validContent(parentList.node.content)
      ) {
        const { tr } = state;
        tr.setNodeMarkup(parentList.pos, listType);

        if (dispatch) {
          dispatch(tr);
        }

        return false;
      }
    }

    // 判断此时选中的 range 是否可以进行 wrapInList 操作
    const canWrapInList = wrapInList(listType)({
      state,
      dispatch: undefined,
    });

    // 针对那些不可以转换成 list 的，可以先尝试先设置回 paragraph，然后再设置
    // heading => bullet_list/ordered_list
    // todolist => bullet_list/ordered_list
    if (!canWrapInList) {
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
      console.log(tr === props.state.tr);
      wrapInList(listType)(props);

      return view.dispatch(tr);
    }

    return wrapInList(listType)({ state, dispatch, view });
  };
}
