import { message } from 'antd';
import { TocItem, TocStepItem } from '@tuture/local-server';

import { Dispatch, RootState } from '../store';
import { saveData } from '../utils/request';

export type TocState = {
  isSaving: boolean;
  activeArticle: string;
  needDeleteOutdatedStepList: string[];
  articleStepList: TocItem[];
  unassignedStepList: TocStepItem[];
  deleteOutdatedStepList?: TocStepItem[];
};

const initialState: TocState = {
  isSaving: false,
  activeArticle: '',
  needDeleteOutdatedStepList: [],
  articleStepList: [],
  unassignedStepList: [],
};

export const toc = {
  state: initialState,
  reducers: {
    setSaveStatus(state: TocState, isSaving: boolean) {
      state.isSaving = isSaving;
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
    async fetchToc() {
      try {
        const response = await fetch('/toc');
        const data: {
          articleStepList: TocStepItem[];
          unassignedStepList: TocStepItem[];
        } = await response.json();

        dispatch.toc.setUnassignedStepList(data.unassignedStepList);
        dispatch.toc.setArticleStepList(data.articleStepList);
      } catch {
        message.error('获取目录失败！');
      }
    },
    async save(_: any, rootState: RootState) {
      const {
        articleStepList = [],
        unassignedStepList = [],
        needDeleteOutdatedStepList = [],
      } = rootState.toc;

      const success = await saveData(
        {
          articleStepList,
          unassignedStepList,
          needDeleteOutdatedStepList,
        },
        '/toc',
      );

      if (!success) {
        return message.error('目录保存失败！');
      }

      const { nowArticleId = '' } = rootState.collection;

      const nowArticleIdList = articleStepList
        .filter((item) => item.type === 'article')
        .map((item) => item.id);

      if (nowArticleId && !nowArticleIdList.includes(nowArticleId)) {
        dispatch.collection.setNowArticle('');
      }

      // Update collection data.
      await dispatch.collection.fetchArticles();
      await dispatch.collection.fetchFragment();

      message.success('目录保存成功');
    },
  }),
};
