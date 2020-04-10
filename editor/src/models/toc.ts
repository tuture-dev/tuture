import { message } from 'antd';
import omit from 'lodash.omit';

import { Dispatch, RootState } from '../store';
import { TocItem, TocStepItem } from '../types';
import { flatten } from 'utils/collection';
import { Step } from '../../../types';

function getArticleIdFromId(items: TocItem[], stepId: string) {
  const item = items.filter((item) => item.id === stepId)[0];
  return (item as TocStepItem).articleId;
}

export type TocState = {
  isSaving: boolean;
  activeArticle: string;
  needDeleteOutdatedStepList: string[];
  articleStepList?: TocStepItem[];
  unassignedStepList?: TocStepItem[];
  deleteOutdatedStepList?: TocStepItem[];
};

const initialState: TocState = {
  isSaving: false,
  activeArticle: '',
  needDeleteOutdatedStepList: [],
};

export const toc = {
  state: initialState,
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

      if (state.unassignedStepList) {
        const newUnassignedStepList = state.unassignedStepList.filter(
          (step) => step.id !== stepId,
        );
        state.unassignedStepList = newUnassignedStepList;
      }
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
      const { nowArticleId = '' } = rootState.collection;
      let { steps = [] } = rootState.collection.collection || {};
      let { articles = [] } = rootState.collection.collection || {};

      // handle article deletion
      const nowArticleIdList = articleStepList
        .filter((item) => !item.articleId)
        .map((item) => item.id);
      articles = articles.filter((article) =>
        nowArticleIdList.includes(article.id),
      );

      if (!nowArticleIdList.includes(nowArticleId as string)) {
        dispatch.collection.setNowArticle('');
      }

      // handle step allocation
      const nowAllocationStepList = articleStepList.filter(
        (item) => item.articleId,
      );
      const nowAllocationStepIdList = nowAllocationStepList.map(
        (item) => item.id,
      );

      steps = steps.map((step) => {
        if (nowAllocationStepIdList.includes(step.id)) {
          step.articleId = getArticleIdFromId(nowAllocationStepList, step.id);
        }
        return step;
      });

      const unassignedStepIdList = unassignedStepList.map((step) => step.id);
      steps = steps.map((step) => {
        if (unassignedStepIdList.includes(step.id)) {
          step = omit(step, ['articleId']) as Step;
        }
        return step;
      });

      // delete outdated deleted step
      steps = steps.filter(
        (step) => !needDeleteOutdatedStepList.includes(step.id),
      );

      dispatch.collection.updateArticles(articles);
      dispatch.collection.updateSteps(steps);

      let nowSteps;

      if (nowArticleId) {
        nowSteps = flatten(
          steps.filter((step) => step.articleId === nowArticleId),
        );
      } else {
        nowSteps = flatten(steps);
      }

      dispatch.collection.setNowSteps(nowSteps);
      dispatch.collection.saveCollection();

      message.success('目录保存成功');
    },
  }),
};
