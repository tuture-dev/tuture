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

export { spliceStr, insertStr };
