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
    setVisible(state: any, payload: any) {
      state.visible = payload;

      return state;
    },
    setDrawerType(state: any, payload: any) {
      state.drawerType = payload;

      return state;
    },
    setSelectedKeys(state: any, payload: any) {
      state.selectedKeys = payload;

      return state;
    },
    setChildrenVisible(state: any, payload: any) {
      state.childrenVisible = payload;
      return state;
    },
    setChildrenDrawerType(state: any, payload: any) {
      state.childrenDrawerType = payload;

      return state;
    },
  },
};

export default drawer;
