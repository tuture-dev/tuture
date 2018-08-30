import { observable, action } from 'mobx';

import { Tuture } from '../types/';
import { reorder } from '../utils/common';

class Store {
  @observable
  isEditMode = true;

  @observable
  tuture: Tuture;

  @action
  updateIsEditMode() {
    this.isEditMode = !this.isEditMode;
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
