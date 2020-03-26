import { NORMAL } from '../utils/constants';

const versionControl = {
  state: {
    commitStatus: NORMAL,
    stage: [],
    master: [],
    workingBranch: [],
    branches: [],
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    setCommitStatus(state: any, payload: any) {
      state.commitStatus = payload;

      return state;
    },
  },
};

export default versionControl;
