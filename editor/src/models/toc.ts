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
  activeArticle: string;
  needDeleteOutdatedStepList: string[];
  articleStepList: TocStepItem[];
  unassignedStepList: TocStepItem[];
  deleteOutdatedStepList: TocStepItem[];
};

export const toc = {
  state: {
    isSaving: false,
    activeArticle: '',
    needDeleteOutdatedStepList: [],
    articleStepList: [],
    unassignedStepList: [],
  },
  reducers: {
    setSaveStatus(state: TocState, isSaving: boolean) {
      state.isSaving = isSaving;
      return state;
    },
    setArticleStepList(state: TocState, payload: TocStepItem[]) {
      state.articleStepList = payload;
    },
    setActiveArticle(state: TocState, payload: string) {
      state.activeArticle = payload;
    },
    setUnassignedStepList(state: TocState, payload: TocStepItem[]) {
      state.unassignedStepList = payload;
    },
    deleteOutdatedStepList(state: TocState, stepId: string) {
      state.needDeleteOutdatedStepList = state.needDeleteOutdatedStepList.concat(
        stepId,
      );

      const newUnassignedStepList = state.unassignedStepList.filter(
        (step: any) => step.id !== stepId,
      );
      state.unassignedStepList = newUnassignedStepList;
    },
    reset(state: TocState) {
      state.activeArticle = '';
      state.needDeleteOutdatedStepList = [];
      state.articleStepList = [];
      state.unassignedStepList = [];
      state.isSaving = false;
    },
  },
  effects: (dispatch: Dispatch) => ({
    async save(_: any, rootState: RootState) {
      const {
        articleStepList = [],
        unassignedStepList = [],
        needDeleteOutdatedStepList = [],
      } = rootState.toc;
      let { steps = [] } = rootState.collection.collection || {};
      let { articles = [] } = rootState.collection.collection || {};

      // handle article deletion
      const nowArticleIdList = (articleStepList as TocStepItem[])
        .filter((item) => !item.articleId)
        .map((item) => item.id);
      articles = articles.filter((article: any) =>
        nowArticleIdList.includes(article.id),
      );

      // handle step allocation
      const nowAllocationStepList = (articleStepList as TocStepItem[]).filter(
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

      const unassignedStepIdList = (unassignedStepList as TocStepItem[]).map(
        (step) => step.id,
      );
      steps = steps.map((step: any) => {
        if (unassignedStepIdList.includes(step.id)) {
          step = omit(step, ['articleId']) as Step;
        }
        return step;
      });

      // delete outdated deleted step
      steps = steps.filter(
        (step: any) =>
          !(needDeleteOutdatedStepList as TocStepItem[]).includes(step.id),
      );

      dispatch.collection.updateArticles(articles);
      dispatch.collection.updateSteps(steps);

      dispatch.collection.saveCollection();

      message.success('目录保存成功');
    },
  }),
};
