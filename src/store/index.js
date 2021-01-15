import Vue from 'vue';
import Vuex from 'vuex';

import font from './font';
import music from './music';
import project from './project';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    font,
    music,
    project,
  },
});
