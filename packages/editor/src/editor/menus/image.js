import isNodeActive from "../queries/isNodeActive";

export default function imageMenuItems(state, dictionary) {
  const { schema } = state;
  const isLeftAligned = isNodeActive(schema.nodes.image, {
    layoutClass: "left-50",
  });
  const isRightAligned = isNodeActive(schema.nodes.image, {
    layoutClass: "right-50",
  });

  return [
    {
      name: "alignLeft",
      icon: "align-left",
      tooltip: dictionary.alignImageLeft,
      visible: true,
      active: isLeftAligned,
    },
    {
      name: "alignCenter",
      icon: "align-center",
      tooltip: dictionary.alignImageCenter,
      visible: true,
      active: (state) =>
        isNodeActive(schema.nodes.image)(state) &&
        !isLeftAligned(state) &&
        !isRightAligned(state),
    },
    {
      name: "alignRight",
      icon: "align-right",
      tooltip: dictionary.alignImageRight,
      visible: true,
      active: isRightAligned,
    },
    {
      name: "separator",
      visible: true,
    },
    {
      name: "deleteImage",
      tooltip: dictionary.deleteImage,
      icon: "trash-alt",
      visible: true,
      active: () => false,
    },
  ];
}
