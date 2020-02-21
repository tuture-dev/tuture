import { DRAWER_UNSELECT } from '../utils/constants';

const drawer = {
  state: {
    childrenVisible: false,
    visible: false,
    drawerType: '',
    childrenDrawerType: DRAWER_UNSELECT,
    selectedKeys: [],
  },
  reducers: {
    setVisible(state, payload) {
      state.visible = payload;

      return state;
    },
    setDrawerType(state, payload) {
      state.drawerType = payload;

      return state;
    },
    setSelectedKeys(state, payload) {
      state.selectedKeys = payload;

      return state;
    },
    setChildrenVisible(state, payload) {
      state.childrenVisible = payload;
      return state;
    },
    setChildrenDrawerType(state, payload) {
      state.childrenDrawerType = payload;

      return state;
    },
  },
};

export default drawer;
