import { message } from 'antd';
import omit from 'lodash.omit';

function getArticleIdFromId(stepList: [any], stepId: any) {
  const articleId = stepList.filter((step) => step.id === stepId)[0].articleId;

  return articleId;
}

const toc = {
  state: {
    isSaving: false,
  },
  reducers: {
    setSaveStatus(state: any, payload: any): any {
      state.isSaving = payload;

      return state;
    },
  },
  effects: (dispatch: any) => ({
    async save(payload: any, rootState: any) {
      const {
        articleStepList = [],
        unassignedStepList = [],
        deleteOutdatedStepList = [],
      } = payload;
      let { steps = [] } = rootState.collection.collection || {};
      let { articles = [] } = rootState.collection.collection || {};

      // handle article deletion
      const nowArticleIdList = articleStepList
        .filter((step: any) => !step?.articleId)
        .map((step: any) => step.id);
      articles = articles.filter((article: any) =>
        nowArticleIdList.includes(article.id),
      );

      // handle step allocation
      const nowAllocationStepList = articleStepList.filter(
        (step: any) => step?.articleId,
      );
      const nowAllocationStepIdList = nowAllocationStepList.map(
        (step: any) => step.id,
      );

      steps = steps.map((step: any) => {
        if (nowAllocationStepIdList.includes(step.id)) {
          const articleId = getArticleIdFromId(nowAllocationStepList, step.id);

          step.articleId = articleId;
        }

        return step;
      });

      const unassignedStepIdList = unassignedStepList.map(
        (step: any) => step.id,
      );
      steps = steps.map((step: any) => {
        if (unassignedStepIdList.includes(step.id)) {
          step = omit(step, ['articleId']);
        }

        return step;
      });

      // delete outdated deleted step
      steps = steps.filter(
        (step: any) => !deleteOutdatedStepList.includes(step.id),
      );

      dispatch.collection.updateArticles(articles);
      dispatch.collection.updateSteps(steps);

      dispatch.collection.saveCollection();

      message.success('目录保存成功');
      dispatch.toc.setSaveStatus(false);
    },
  }),
};

export default toc;
