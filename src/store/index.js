import Vue from 'vue';
import Vuex from 'vuex';
import mockSettings from '~/api/mock/settings';
import mockResults from '~/api/mock/results';
import mockCharactors from '~/api/mock/charactors';
import mockParks from '~/api/mock/parks';

const dateFormat = date => {
  let result = null;
  if (date === undefined || date === null) {
    result = new Date();
  } else {
    result = new Date(date);
  }
  console.log(result)
  return result.toLocaleString();
};

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
  getters: {
    getMode: state => state.mode.split('/')[0],

    getModeId: state => state.mode.split('/')[1],
  },
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
  getters: {
    getPark: state => parkId =>
      state.data.find(r => r.id === parkId),

    getFilterByKillerType: state =>
      state.data.filter(p => p.type === 'killer'),

    getFilterBySurvivorType: state =>
      state.data.filter(p => p.type === 'survivor'),
  },
};

const RESULTS_MUTATIONS_TYPE = {
  FETCH_RESULTS: 'fetch',
  DELETE: 'delete',
  UPDATE: 'update',
  CREATE: 'create',
};
const results = {
  namespaced: true,
  state: {
    data: [],
  },
  mutations: {
    [RESULTS_MUTATIONS_TYPE.FETCH_RESULTS](state, value) {
      state.data = value.results;
    },
    [RESULTS_MUTATIONS_TYPE.DELETE](state, value) {
      state.mode = value;
    },
    [RESULTS_MUTATIONS_TYPE.UPDATE](state, value) {
      const target = state.data.find(d =>
        value.id.toString(10) === d.id.toString(10))
      console.log(value, target)
      target[value.key] = value.value
    },
    [RESULTS_MUTATIONS_TYPE.CREATE](state) {
      state.data[state.data.length] = { id: state.data.length };
    },
  },
  actions: {
    initialize({ commit }) {
      const data = mockResults;
      commit(RESULTS_MUTATIONS_TYPE.FETCH_RESULTS, data);
    },

    delete({ commit, state }, value) {
      commit(RESULTS_MUTATIONS_TYPE.DELETE, value);
      localStorage.setItem('results', JSON.stringify(state.data));
    },

    update({ commit, state }, value) {
      console.log(value, state)
      commit(RESULTS_MUTATIONS_TYPE.UPDATE, value);
      localStorage.setItem('results', JSON.stringify(state.data));
    },

    create({ commit, state }) {
      commit(RESULTS_MUTATIONS_TYPE.CREATE);
      localStorage.setItem('results', JSON.stringify(state.data));
    },
  },
  getters: {
    getResult: state => resultId =>
      state.data.find(r => r.id === parseInt(resultId, 10)),

    getCharactor: (state, getter, rootState, rootGetter) => resultId => {
      const result = getter.getResult(resultId);
      return rootGetter['charactors/getCharactor'](result.charactor_id);
    },

    getMyParks: (state, getter, rootState, rootGetter) => resultId => {
      const result = getter.getResult(resultId);
      return result.my_park_ids.map(id => rootGetter['parks/getPark'](id));
    },

    getObtainPip: (state, getter) => resultId => {
      const result = getter.getResult(resultId);

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
    },

    createdDateTime: (state, getter) => resultId => {
      const result = getter.getResult(resultId);
      return dateFormat(result.created);
    },

    updateDateTime: (state, getter) => resultId => {
      const result = getter.getResult(resultId);
      return dateFormat(result.update);
    },

    playDateTime: (state, getter) => resultId => {
      const result = getter.getResult(resultId);
      return dateFormat(result.date);
    },

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
