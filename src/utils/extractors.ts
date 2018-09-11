const extractCommits = (tuture: Tuture) => {
  const commits = tuture.steps.map((item: Step) => ({
    name: item.name,
    commit: item.commit,
  }));

  return commits;
};

const extractMetaData = (tuture: Tuture) => {
  const { name, topics, description } = tuture;
  const metadata = {
    name,
    topics,
    description,
  };

  return metadata;
};

export { extractCommits, extractMetaData };
