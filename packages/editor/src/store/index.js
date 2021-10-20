import Vue from 'vue';
import Vuex from 'vuex';

import * as collection from './collection';
import * as drawer from './drawer';
import * as toc from './toc';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    collection,
    drawer,
    toc,
  },
});
