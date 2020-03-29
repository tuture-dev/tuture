import { message } from 'antd';
import omit from 'lodash.omit';

import { Dispatch, RootState } from '../store';
import { TocItem, TocStepItem } from '../types';
import { Step } from '../../../types';

function getArticleIdFromId(items: TocItem[], stepId: string) {
  const item = items.filter((item) => item.id === stepId)[0];
  return (item as TocStepItem).articleId;
}

export type TocState = {
  isSaving: boolean;
};

export const toc: any = {
  state: {
    isSaving: false,
  },
  reducers: {
    setSaveStatus(state: TocState, isSaving: boolean) {
      state.isSaving = isSaving;
      return state;
    },
  },
  effects: (dispatch: Dispatch) => ({
    async save(
      payload: {
        articleStepList?: TocItem[];
        unassignedStepList?: TocStepItem[];
        deleteOutdatedStepList?: TocStepItem[];
      },
      rootState: RootState,
    ) {
      const {
        articleStepList = [],
        unassignedStepList = [],
        deleteOutdatedStepList = [],
      } = payload;
      let { steps = [] } = rootState.collection.collection || {};
      let { articles = [] } = rootState.collection.collection || {};

      // handle article deletion
      const nowArticleIdList = articleStepList
        .filter((item) => !(item as TocStepItem).articleId)
        .map((item) => item.id);
      articles = articles.filter((article: any) =>
        nowArticleIdList.includes(article.id),
      );

      // handle step allocation
      const nowAllocationStepList = articleStepList.filter(
        (item) => (item as TocStepItem).articleId,
      );
      const nowAllocationStepIdList = nowAllocationStepList.map(
        (item) => item.id,
      );

      steps = steps.map((step: any) => {
        if (nowAllocationStepIdList.includes(step.id)) {
          step.articleId = getArticleIdFromId(nowAllocationStepList, step.id);
        }
        return step;
      });

      const unassignedStepIdList = unassignedStepList.map((step) => step.id);
      steps = steps.map((step: any) => {
        if (unassignedStepIdList.includes(step.id)) {
          step = omit(step, ['articleId']) as Step;
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
