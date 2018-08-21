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

const vwDesign = 1680;
const vwFontsize = 168;

function rem(px: number) {
  return px / vwFontsize;
}

export { handleAnchor, isClientOrServer, reorder, rem, vwDesign, vwFontsize };
