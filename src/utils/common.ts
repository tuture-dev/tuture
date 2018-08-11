function handleAnchor(origin: string) {
  return origin.toLowerCase().replace(/ /g, '-');
}

function isClientOrServer() {
  return typeof window !== 'undefined' && window.document ? 'client' : 'server';
}

const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const spliceStr = (str = '', typeStr: string, start: number, end: number) => {
  return str
    .slice(0, start)
    .concat(
      typeStr,
      str.slice(start, end),
      typeStr,
      str.slice(end, str.length),
    );
};

const insertStr = (str = '', typeStr: string, insertPosition: number) => {
  return str
    .slice(0, insertPosition)
    .concat(typeStr, str.slice(insertPosition, str.length));
};

export { handleAnchor, isClientOrServer, reorder, spliceStr, insertStr };
