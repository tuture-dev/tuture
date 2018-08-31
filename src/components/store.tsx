import { observable, action, computed } from 'mobx';

import { Tuture, Step, Diff } from '../types/';
import { handleAnchor } from '../utils/common';

class Store {
  @observable
  isEditMode = true;

  @observable
  tuture: Tuture;

  @observable
  nowSelected: string;

  @computed
  get updateTuture() {
    return this.tuture;
  }

  @action
  updateIsEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  @action
  setTuture(tuture: Tuture) {
    this.tuture = tuture;
  }

  @action
  updateStepName(commit: string, value: string) {
    const tuture = this.tuture;
    if (!tuture) {
      return;
    }
    let stepIndex = 0;
    tuture.steps.filter((step, index) => {
      if (step.commit === commit) {
        stepIndex = index;
      }
    });
    const step = tuture.steps[stepIndex];
    step.name = value;
  }

  @action
  updateTutureExplain(
    commit: string,
    diffKey: string,
    name: 'pre' | 'post',
    value: string,
  ) {
    const tuture = this.tuture;
    let stepIndex = 0;
    tuture.steps.filter((step, index) => {
      if (step.commit === commit) {
        stepIndex = index;
      }
    });
    const step = tuture.steps[stepIndex];
    if (diffKey === 'root') {
      step.explain = { ...step.explain, [name]: value };
    } else {
      const diff = step.diff[parseInt(diffKey, 10)];
      diff.explain = { ...diff.explain, [name]: value };
    }
  }
}

export default Store;
