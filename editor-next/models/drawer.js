import { DRAWER_UNSELECT, PAGE_CATAGUE } from '../utils/constants';

const drawer = {
  state: {
    childrenVisible: false,
    visible: true,
    drawerType: PAGE_CATAGUE,
    childrenDrawerType: DRAWER_UNSELECT,
  },
  reducers: {
    setChildrenVisible(state, payload) {
      state.childrenVisible = payload;
      return state;
    },
    setVisible(state, payload) {
      state.visible = payload;

      return state;
    },
    setDrawerType(state, payload) {
      state.drawerType = payload;

      return state;
    },
    setChildrenDrawerType(state, payload) {
      state.childrenDrawerType = payload;

      return state;
    },
  },
};

export default drawer;
