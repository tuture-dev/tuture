import { findParentNode } from 'prosemirror-utils';
import { wrapInList, liftListItem } from 'prosemirror-schema-list';

// 自动感知的能力，因为 list 就那么几种，在函数侧做的少，那么使用的时候就要做得多
export const itemListType = [
  ['list_item', 'bullet_list'],
  ['list_item', 'ordered_list'],
  ['todo_item', 'todo_list'],
];

export function getItemFromList(list) {
  const item = itemListType.filter((itemList) => itemList[1] === list);

  if (item && item.length > 0) return item?.[0]?.[0];
  else return '';
}

export function getListFromItem(item) {
  const list = itemListType.filter((itemList) => itemList[0] === item);

  if (list && list.length > 0) return list?.[0]?.[1];
  else return '';
}

export function isList(node, schema) {
  return (
    node.type === schema.nodes.bullet_list ||
    node.type === schema.nodes.ordered_list ||
    node.type === schema.nodes.todo_list
  );
}

export function toggleList(listType) {
  return (state, dispatch, view) => {
    const { schema, selection } = state;
    const { $from, $to } = selection;
    const range = $from.blockRange($to);

    if (!range) {
      return false;
    }

    // 如果当前在  list 里面，那就 unwrap，否则就 wrapInList
    const parentList = findParentNode((node) => isList(node, schema))(
      selection,
    );

    if (range.depth >= 1 && parentList && range.depth - parentList.depth <= 1) {
      const listName = parentList.node.type.name;
      const itemType = schema.nodes[getItemFromList(listName)];

      if (parentList.node.type === listType) {
        return liftListItem(itemType)(state, dispatch);
      }

      console.log(listType.validContent(parentList.node.content));

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

    // 如果是其他的块

    return wrapInList(listType)(state, dispatch, view);
  };
}
