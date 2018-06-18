import { Step, Tuture } from '../types/index';

const handleSteps = (tuture: Tuture) => {
  const catalogs = tuture.steps.map((item: Step) => ({
    name: item.name,
    commit: item.commit,
  }));

  return catalogs;
};

const handleStepsInfo = (tuture: Tuture) => {
  const { name, language, maintainer, topics } = tuture;
  const stepsInfo = {
    name,
    language,
    maintainer,
    topics,
  };

  return stepsInfo;
}

export {
  handleSteps,
  handleStepsInfo,
}
