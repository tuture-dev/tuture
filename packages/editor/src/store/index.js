import Vue from 'vue';
import Vuex from 'vuex';

import * as drawer from './drawer';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    drawer,
  },
});
