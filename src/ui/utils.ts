export const vwDesign = 1680;
export const vwFontsize = 168;

export const rem = (px: number) => px / vwFontsize;

export const handleAnchor = (origin: string) =>
  origin.toLowerCase().replace(/ /g, '-');

export const isClientOrServer = () =>
  typeof window !== 'undefined' && window.document ? 'client' : 'server';

export const reorder = (
  list: any,
  startIndex: number,
  endIndex: number,
): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const extractCommits = (tuture: Tuture) => {
  const commits = tuture.steps.map((item: Step) => ({
    name: item.name,
    commit: item.commit,
  }));

  return commits;
};

export const extractMetaData = (tuture: Tuture) => {
  const { name, topics, description } = tuture;
  const metadata = {
    name,
    topics,
    description,
  };

  return metadata;
};
