export const namespaced = true;

export const state = () => ({
  visible: false,
  childVisible: false,
  drawerType: '',
  childDrawerType: '',
  selectedKeys: [],
});

export const mutations = {
  setVisible(state, visible) {
    state.visible = visible;
  },
  setChildVisible(state, visible) {
    state.childVisible = visible;
  },
  setDrawerType(state, type) {
    state.drawerType = type;
  },
  setChildDrawerType(state, type) {
    state.childDrawerType = type;
  },
  setSelectedKeys(state, keys) {
    state.selectedKeys = keys;
  },
};
