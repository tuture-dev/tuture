export default function tableColMenuItems(state, index, dictionary) {
  return [
    {
      name: "addRowBefore",
      icon: "chevron-up",
      tooltip: dictionary.addRowBefore,
      attrs: { index: index - 1 },
      active: () => false,
    },
    {
      name: "addRowAfter",
      icon: "chevron-down",
      tooltip: dictionary.addRowAfter,
      attrs: { index },
      active: () => false,
    },
    {
      name: "separator",
    },
    {
      name: "deleteRow",
      icon: "trash-alt",
      tooltip: dictionary.deleteRow,
      active: () => false,
    },
  ];
}
