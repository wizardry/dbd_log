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
  FETCH_CHARACTORS: 'fetch',
};
const charactors = {
  namespaced: true,
  state: {
    data: [],
  },
  mutations: {
    [CHARACTORS_MUTATIONS_TYPE.FETCH_CHARACTORS](state, value) {
      state.data = value.charactors;
    },
  },
  actions: {
    initialize({ commit }) {
      const data = mockCharactors;
      commit(CHARACTORS_MUTATIONS_TYPE.FETCH_CHARACTORS, data);
    },
  },
  getters: {
    getCharactor: state => charactorId =>
      state.data.find(r => r.id === charactorId),
  },
};

const PRAKS_MUTATIONS_TYPE = {
  FETCH_PARKS: 'fetch',
};
const parks = {
  namespaced: true,
  state: {
    data: []
  },
  mutations: {
    [PRAKS_MUTATIONS_TYPE.FETCH_PARKS](state, value) {
      state.data = value.parks;
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
  FETCH_RESULTS: 'fetch',
};
const results = {
  namespaced: true,
  state: {
    data: [],
  },
  mutations: {
    [RESULTS_MUTATIONS_TYPE.FETCH_RESULTS](state, value) {
      console.log(value.results);
      state.data = value.results;
    },
  },
  actions: {
    initialize({ commit }) {
      const data = mockResults;
      commit(RESULTS_MUTATIONS_TYPE.FETCH_RESULTS, data);
    },
  },
  getters: {
    getResult: state => resultId => state.data.find(r => r.id === resultId),
    getCharactor: (state, getter, rootState, rootGetter) => resultId => {
      const result = getter.getResult(resultId);
      return rootGetter['charactors/getCharactor'](result.charactor_id);
    },
    getPark: (state, getter, rootState) => parkId =>
      rootState.parks.data.find(park => park.id === parkId),
    getObtainPip: (state, getter) => resultId => {
      const result = getter.getResult(resultId);
      console.log(result, result.emblems)
      if (!result.emblems) {
        return 0;
      }

      let emblemScore = 0;
      Object.keys(result.emblems).forEach(emblem => {
        if (result.emblems[emblem] == null) {
          return;
        }
        emblemScore += result.emblems[emblem];
      });

      console.log(
        emblemScore,
        emblemScore <= 5,
        emblemScore <= 8,
        emblemScore <= 13,
        emblemScore <= 16
      );

      if (emblemScore <= 5) {
        return -1;
      } else if (emblemScore <= 8) {
        return 0;
      } else if (emblemScore <= 13) {
        return 1;
      } else if (emblemScore <= 16) {
        return 2;
      }

      console.error('getObtainPip error');
      return 0;
    }
  },
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
