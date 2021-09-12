export default function tableMenuItems(dictionary) {
  return [
    {
      name: "deleteTable",
      icon: "trash-alt",
      tooltip: dictionary.deleteTable,
      active: () => false,
    },
  ];
}
