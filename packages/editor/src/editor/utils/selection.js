export const getAncestorNodeTypeName = ($pos) => {
  let nodeTypeNameArr = [];
  for (let i = $pos.depth; i > 0; i--) {
    const node = $pos.node(i);

    nodeTypeNameArr.push(node.type.name);
  }

  return nodeTypeNameArr;
};
