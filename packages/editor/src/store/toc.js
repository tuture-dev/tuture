export const namespaced = true;

export const state = () => ({
  tocVisible: false,
  tocLoading: false,
  tocSaving: false,
  releasedSteps: [],
  articleSteps: [],
});

export const mutations = {
  setTocVisible(state, visible) {
    state.tocVisible = visible;
  },
  setTocLoading(state, loading) {
    state.tocLoading = loading;
  },
  setTocSaving(state, saving) {
    state.tocSaving = saving;
  },
  setReleasedSteps(state, releasedSteps) {
    state.releasedSteps = releasedSteps;
  },
  deleteReleasedStep(state, stepId) {
    state.releasedSteps = state.releasedSteps.filter(
      (step) => step.id !== stepId,
    );
  },
  setArticleSteps(state, articleSteps) {
    state.articleSteps = articleSteps;
  },
  insertArticleStep(state, { start, item }) {
    state.articleSteps.splice(start, 0, item);
  },
};

export const actions = {
  async fetchToc({ commit }) {
    commit('setTocLoading', true);
    const resp = await fetch('/api/toc');
    const { unassignedStepList, articleStepList } = await resp.json();
    commit('setArticleSteps', articleStepList);
    commit('setReleasedSteps', unassignedStepList);
    commit('setTocLoading', false);
  },
  async saveToc({ state, commit }) {
    commit('setTocSaving', true);
    await fetch('/api/toc', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        articleStepList: state.articleSteps,
        unassignedStepList: state.releasedSteps,
      }),
    });
    commit('setTocSaving', false);
    commit('setTocVisible', false);
  },
};
