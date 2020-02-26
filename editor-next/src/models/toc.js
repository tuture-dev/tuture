import { message } from 'antd';
import omit from 'lodash.omit';

function getArticleIdFromId(stepList, stepId) {
  const articleId = stepList.filter((step) => step.id === stepId)[0].articleId;

  return articleId;
}

const toc = {
  state: {
    isSaving: false,
  },
  reducers: {
    setSaveStatus(state, payload) {
      state.isSaving = payload;

      return state;
    },
  },
  effects: (dispatch) => ({
    async save(payload, rootState) {
      const { articleStepList = [], unassignedStepList = [] } = payload;
      let { steps = [] } = rootState.collection.collection || {};
      let { articles = [] } = rootState.collection.collection || {};

      // handle article deletion
      const nowArticleIdList = articleStepList
        .filter((step) => !step?.articleId)
        .map((step) => step.id);
      articles = articles.filter((article) =>
        nowArticleIdList.includes(article.id),
      );

      // handle step allocation
      const nowAllocationStepList = articleStepList.filter(
        (step) => step?.articleId,
      );
      const nowAllocationStepIdList = nowAllocationStepList.map(
        (step) => step.id,
      );

      steps = steps.map((step) => {
        if (nowAllocationStepIdList.includes(step.id)) {
          const articleId = getArticleIdFromId(nowAllocationStepList, step.id);

          step.articleId = articleId;
        }

        return step;
      });

      const unassignedStepIdList = unassignedStepList.map((step) => step.id);
      steps = steps.map((step) => {
        if (unassignedStepIdList.includes(step.id)) {
          step = omit(step, ['articleId']);
        }

        return step;
      });

      dispatch.collection.updateArticles(articles);
      dispatch.collection.updateSteps(steps);

      message.success('目录保存成功');
      this.setSaveStatus(false);
    },
  }),
};

export default toc;
