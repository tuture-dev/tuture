import Vue from 'vue';
import Vuex from 'vuex';

import * as collection from './collection';
import * as drawer from './drawer';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    collection,
    drawer,
  },
});
