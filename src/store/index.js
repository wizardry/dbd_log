import Vue from 'vue';
import Vuex from 'vuex';
import mockSettings from '~/api/mock/settings';
import mockResults from '~/api/mock/results';
import mockCharactors from '~/api/mock/charactors';
import mockParks from '~/api/mock/parks';

// const mockResults = { results: [] };

const debug = false;

const dateFormat = date => {
  let result = null;
  if (date === undefined || date === null) {
    result = new Date();
  } else {
    result = new Date(date);
  }
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
  },
  mutations: {
    [SETTINGS_MUTATIONS_TYPE.FETCH_SETTINGS](state, value) {
      state.mode = value.mode;
      state.settings = value.settings;
      state.user = value.user;
    },
    [SETTINGS_MUTATIONS_TYPE.CHANGE_MODE](state, value) {
      state.mode = value;
    },
  },
  actions: {
    initialize({ commit }) {
      let data = debug ? mockSettings.app
        : JSON.parse(localStorage.getItem('settings'));

      if (!data) {
        data = mockSettings.app;
      }

      commit(SETTINGS_MUTATIONS_TYPE.FETCH_SETTINGS, data);
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

const initResultTemplate = () => ({
  id: null,
  created: null,
  update: null,
  date: null,
  charactor_id: null,
  score: 0,
  emblems: {
    gatekeeper: 0,
    devout: 0,
    malicious: 0,
    chaser: 0,
    lightbringer: 0,
    unbroken: 0,
    benevolent: 0,
    evader: 0,
  },
  my_park_ids: [null, null, null, null],
  player_parks: {
    killer_ids: [null, null, null, null],
    survivors_ids: [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]
  },
  players_status: {
    player_1: 0,
    player_2: 0,
    player_3: 0,
    player_4: 0,
  },
  status: 0,
  fixed_generator: 0,
  played_user: {
    survivor: {
      rank: null,
      pip: null,
    },
    killer: {
      rank: null,
      pip: null,
    },
  },
  last_played_user: {
    survivor: {
      rank: null,
      pip: null,
    },
    killer: {
      rank: null,
      pip: null,
    },
  },
  comment: '',
});

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
      state.data = state.data.filter(result => result.id !== value);
    },
    [RESULTS_MUTATIONS_TYPE.UPDATE](state, value) {
      const target = state.data.find(d =>
        value.id.toString(10) === d.id.toString(10))
      target[value.key] = value.value
      target.update = new Date();
    },
    [RESULTS_MUTATIONS_TYPE.CREATE](state) {
      const result = initResultTemplate();
      result.id = state.data.slice(-1)[0] !== undefined
        ? parseInt(state.data.slice(-1)[0].id, 10) + 1 : 0;
      result.created = new Date();
      result.update = new Date();
      result.date = new Date();

      console.log(result)

      // 使用キャラクター, 使用パークは最終データを引き継ぐ
      const lastResult = state.data.slice(-1)[0];

      result.charactor_id = lastResult === undefined
        ? 1 : lastResult.charactor_id;
      result.my_park_ids = lastResult === undefined
        ? [null, null, null, null] : lastResult.my_park_ids;
      result.last_played_user = lastResult === undefined
        ? { survivor: { rank: 20, pip: 0 }, killer: { rank: 20, pip: 0 } }
        : lastResult.played_user;

      state.data.push(result);
    },
  },
  actions: {
    initialize({ commit }) {
      let data = debug ? mockResults
        : JSON.parse(localStorage.getItem('results'));

      if (data === undefined || data === null) {
        data = { results: [] };
        localStorage.setItem('results', JSON.stringify(data));
      }

      commit(RESULTS_MUTATIONS_TYPE.FETCH_RESULTS, data);
    },

    delete({ commit, state }, value) {
      commit(RESULTS_MUTATIONS_TYPE.DELETE, value);
      localStorage.setItem('results', JSON.stringify({ results: state.data }));
    },

    update({ commit, state }, value) {
      commit(RESULTS_MUTATIONS_TYPE.UPDATE, value);
      localStorage.setItem('results', JSON.stringify({ results: state.data }));
    },

    create({ commit, state }) {
      commit(RESULTS_MUTATIONS_TYPE.CREATE);
      localStorage.setItem('results', JSON.stringify({ results: state.data }));
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

    // create でしか使用しないためresult idは不要
    addedPipUserData: (state, getters) => pip => {
      const resultId = state.data.slice(-1)[0].id;
      const selectedCharactor =
        getters.getCharactor(resultId);
      console.log(state.data.slice(-1)[0].id)
      const userType = selectedCharactor.type;
      const rankData = state.data.length > 1
        ? JSON.parse(
          JSON.stringify(
            state.data.find(r => r.id === resultId).last_played_user
          )
        )
        : { survivor: { rank: 20, pip: 0 }, killer: { rank: 20, pip: 0 } };

      rankData[userType].pip =
        parseInt(rankData[userType].pip, 10) + parseInt(pip, 10);

      console.log(rankData)
      let maxPip = 5;

      if (rankData[userType].rank > 12) {
        maxPip = 4
      }
      if (rankData[userType].rank > 18) {
        maxPip = 3
      }

      // ランク１でなければ
      if (rankData[userType].rank > 1) {
        // ランクが上がるケース
        if (rankData[userType].pip > maxPip) {
          rankData[userType].pip -= maxPip
          rankData[userType].rank -= 1
        // ランクが下がるケース
        } else if (rankData[userType].pip < 0 && rankData[userType].rank > 20) {
          rankData[userType].pip = maxPip - rankData[userType].pip
          rankData[userType].rank += 1;
        // 20が最下
        } else if (
          rankData[userType].pip < 0
          && rankData[userType].rank <= 20
        ) {
          rankData[userType].rank = 20;
          rankData[userType].pip = 0;
        }
      } else if (rankData[userType].pip > maxPip) {
        // ランク１の場合pip上昇は5まで
        rankData[userType].pip = maxPip
      }

      return rankData;
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
