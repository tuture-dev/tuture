import { observable, computed, action } from 'mobx';

class Store {
  @observable
  isEditMode = true;

  @action
  updateIsEditMode() {
    this.isEditMode = !this.isEditMode;
  }
}

export default Store;
