import { observable, action, computed } from 'mobx';
import classnames from 'classnames';

import { Tuture } from '../types/';
import { handleAnchor } from '../utils/common';

class Store {
  @observable
  isEditMode = true;

  @observable
  tuture: Tuture;

  @observable
  nowSelected: string;

  @observable
  sidebarStatus = false;

  @observable
  isStepListClick = false;

  @computed
  get updateTuture() {
    return this.tuture;
  }

  @computed
  get sidebarOpacityClass() {
    return classnames(
      { showSideBar: this.sidebarStatus },
      { hideSideBar: !this.sidebarStatus },
    );
  }

  @action
  toggleShowSideBar(sidebarStatus: boolean) {
    this.sidebarStatus = sidebarStatus;
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
    tuture.steps.map((step, index) => {
      if (step.commit === commit) {
        stepIndex = index;
      }
    });
    const step = tuture.steps[stepIndex];
    step.name = value;
    this.nowSelected = handleAnchor(value);
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
