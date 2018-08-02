import { Step, Tuture, TutureMeta } from '../types';

const extractCommits = (tuture: Tuture) => {
  const commits = tuture.steps.map((item: Step) => ({
    name: item.name,
    commit: item.commit,
  }));

  return commits;
};

const extractMetaData = (tuture: Tuture): TutureMeta => {
  const { name, language, version, maintainer, topics, description } = tuture;
  const metadata = {
    name,
    language,
    version,
    maintainer,
    topics,
    description,
  };

  return metadata;
};

const extractLanguageType = (fileName: string): string => {
  const extenstionToLanguage: { [index: string]: string } = {
    css: 'css',
    html: 'markup',
    js: 'javascript',
  };
  return extenstionToLanguage[fileName.split('.').pop()];
};

export { extractCommits, extractMetaData, extractLanguageType };
