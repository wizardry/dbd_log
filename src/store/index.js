import Vue from 'vue';
import Vuex from 'vuex';
import mockSettings from '~/api/mock/settings';
import mockResults from '~/api/mock/results';
import mockCharactors from '~/api/mock/charactors';
import mockParks from '~/api/mock/parks';

const SETTINGS_MUTATIONS_TYPE = {
  FETCH_SETTINGS: 'fetch',
  CHANGE_MODE: 'change_mode',
};

const settings = {
  namespaced: true,
  state: {
    mode: '',
    settings: {},
    user: {},
  },
  mutations: {
    [SETTINGS_MUTATIONS_TYPE.FETCH_SETTINGS](state, value) {
      state.mode = value.mode;
      state.settings = value.settings;
      state.user = value.user;
      console.log(state, value)
    },
    [SETTINGS_MUTATIONS_TYPE.CHANGE_MODE](state, value) {
      state.mode = value;
    },
  },
  actions: {
    initialize({ commit }) {
      const data = mockSettings;
      console.log('initialize', data);
      commit(SETTINGS_MUTATIONS_TYPE.FETCH_SETTINGS, data.app);
    },
    changeMode({ commit, state }, value) {
      commit(SETTINGS_MUTATIONS_TYPE.CHANGE_MODE, value);
      localStorage.setItem('settings', JSON.stringify(state));
    },
  },
  getters: {},
};

const CHARACTORS_MUTATIONS_TYPE = {
  FETCH_CHARACTORS: 'charactors/fetch_charactors',
};
const charactors = {
  namespaced: true,
  state: {},
  mutations: {
    [CHARACTORS_MUTATIONS_TYPE.FETCH_CHARACTORS](state, value) {
      state = value.charactors;
    },
  },
  actions: {
    initialize({ commit }) {
      const data = mockCharactors;
      commit(CHARACTORS_MUTATIONS_TYPE.FETCH_CHARACTORS, data);
    },
  },
  getters: {},
};

const PRAKS_MUTATIONS_TYPE = {
  FETCH_PARKS: 'parks/fetch_parks',
};
const parks = {
  namespaced: true,
  state: {},
  mutations: {
    [PRAKS_MUTATIONS_TYPE.FETCH_PARKS](state, value) {
      state = value.parks;
    },
  },
  actions: {
    initialize({ commit }) {
      const data = mockParks;
      commit(PRAKS_MUTATIONS_TYPE.FETCH_PARKS, data);
    },
  },
  getters: {},
};

const RESULTS_MUTATIONS_TYPE = {
  FETCH_RESULTS: 'results/fetch_results',
};
const results = {
  namespaced: true,
  state: {},
  mutations: {
    [RESULTS_MUTATIONS_TYPE.FETCH_RESULTS](state, value) {
      state = value.results;
    },
  },
  actions: {
    initialize({ commit }) {
      const data = mockResults;
      commit(RESULTS_MUTATIONS_TYPE.FETCH_RESULTS, data);
    },
  },
  getters: {},
};

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    settings,
    charactors,
    parks,
    results,
  },
});
