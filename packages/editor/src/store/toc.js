export const namespaced = true;

export const state = () => ({
  tocVisible: false,
});

export const mutations = {
  setTocVisible(state, visible) {
    state.tocVisible = visible;
  },
};
