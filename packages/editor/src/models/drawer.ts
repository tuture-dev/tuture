import { DRAWER_UNSELECT } from '../utils/constants';

export type DrawerState = {
  visible: boolean;
  childrenVisible: boolean;
  drawerType: string;
  childrenDrawerType: string;
  selectedKeys: string[];
};

const initialState: DrawerState = {
  childrenVisible: false,
  visible: false,
  drawerType: '',
  childrenDrawerType: DRAWER_UNSELECT,
  selectedKeys: [],
};

export const drawer = {
  state: initialState,
  reducers: {
    setVisible(state: DrawerState, visible: boolean) {
      state.visible = visible;
      return state;
    },
    setDrawerType(state: DrawerState, type: string) {
      state.drawerType = type;
      return state;
    },
    setSelectedKeys(state: DrawerState, keys: string[]) {
      state.selectedKeys = keys;
      return state;
    },
    setChildrenVisible(state: DrawerState, visible: boolean) {
      state.childrenVisible = visible;
      return state;
    },
    setChildrenDrawerType(state: DrawerState, type: string) {
      state.childrenDrawerType = type;
      return state;
    },
  },
};
