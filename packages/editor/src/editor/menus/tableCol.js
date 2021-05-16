import { isNodeActive } from "../queries";

export default function tableColMenuItems(state, index, dictionary) {
  const { schema } = state;

  return [
    {
      name: "setColumnAttr",
      icon: "align-left",
      tooltip: dictionary.alignLeft,
      attrs: { index, alignment: "left" },
      active: isNodeActive(schema.nodes.th, {
        colspan: 1,
        rowspan: 1,
        alignment: "left",
      }),
    },
    {
      name: "setColumnAttr",
      icon: "align-center",
      tooltip: dictionary.alignCenter,
      attrs: { index, alignment: "center" },
      active: isNodeActive(schema.nodes.th, {
        colspan: 1,
        rowspan: 1,
        alignment: "center",
      }),
    },
    {
      name: "setColumnAttr",
      icon: "align-right",
      tooltip: dictionary.alignRight,
      attrs: { index, alignment: "right" },
      active: isNodeActive(schema.nodes.th, {
        colspan: 1,
        rowspan: 1,
        alignment: "right",
      }),
    },
    {
      name: "separator",
    },
    {
      name: "addColumnBefore",
      icon: "chevron-left",
      tooltip: dictionary.addColumnBefore,
      active: () => false,
    },
    {
      name: "addColumnAfter",
      icon: "chevron-right",
      tooltip: dictionary.addColumnAfter,
      active: () => false,
    },
    {
      name: "separator",
    },
    {
      name: "deleteColumn",
      icon: "trash-alt",
      tooltip: dictionary.deleteColumn,
      active: () => false,
    },
  ];
}
