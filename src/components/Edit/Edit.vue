<template>
  <div>
    <p>edit</p>
    <h2 v-html="title"></h2>
    <form v-if="resultId !== undefined" @submit="onSubmit">
      <dl>
        <dt>id</dt>
        <dd>{{ result.id }}</dd>
        <dt>登録日</dt>
        <dd>{{ registDateTime }}</dd>
        <dt>更新日</dt>
        <dd>{{ updateDateTime }}</dd>
        <dt>試合日</dt>
        <dd>{{ playDateTime }}</dd>
        <dt>使用キャラクター</dt>
        <dd>
          <select
            v-model="inputCharactor"
            ref="charactor"
          >
            <option v-for="charactor in $store.state.charactors.data" :value="charactor.id" >
              {{charactor.name_jp}}/{{charactor.name_en}}
            </option>
          </select>
        </dd>
        <dt>スコア：得点</dt>
        <dd>{{ result.score }}</dd>
        <dt>スコア：エンブレム</dt>
        <dd>
          <ul v-if="result.charactor_id !== null">
            <li v-for="(score, type) in filterByEmblems" :class="type">
              <div @click="changeEmblem(type)">
                score {{ score }}
                <br>
                type {{ type }}
              </div>
            </li>
          </ul>
          {{ result.emblems }}
        </dd>
        <dt>パーク</dt>
        <dd>
          <ul>
            <li v-for="(park_id, index) in result.my_park_ids">
              <select
                :value="park_id"
                @change="changePark"
                :index="index"
                name="park_select"
                ref="park"
              >
                <option v-for="park in filterByParks" :value="park.id" >
                  {{park.name_jp}}/{{park.name_en}}
                </option>
              </select>
            </li>
          </ul>
          {{ result.my_park_ids }}
        </dd>
        <!-- isKillerでの出し分けUIがめんどい -->
        <!-- <dt>参加プレイヤー情報</dt> -->
        <!-- <dd>{{ result.player_park }}</dd> -->
        <dt>全サバイバー状況</dt>
        <dd>
          <ul>
            <li v-for="(status, key) in result.players_status">
              <div @click="onClickSurvivorStatus(key)">
                <span v-if="status == null">未登録</span>
                <span v-else>{{survivorStatusText(status)}}</span>
              </div>
              <div v-if="!isKiller && key === 'player_1'">
                YOUR
              </div>
            </li>
          </ul>
          {{ result.players_status }}
        </dd>
        <div v-if="!isKiller">
          <dt>クリア状況</dt>
          <dd>{{ result.status }}</dd>
        </div>
        <dt>修理された発電機</dt>
        <dd>
          <div @click="onClickFixedGenerator">
            {{ result.fixed_generator }}台
          </div>
        </dd>
        <dt>ランク</dt>
        <dd>
          <p>取得Pip：{{obtainPip}}</p>
          <div v-if="isCreate">
            <p>登録時は最終登録データを参照しエンブレムスコアから自動算出されるため編集できません。</p>
            <ul>
              <li>rank: {{userRank.rank}}</li>
              <li>pip: {{userRank.pip}}</li>
            </ul>
          </div>
          <div v-else>
            {{ result.played_user }}
          </div>
        </dd>
        <dt>コメント</dt>
        <dd>
          <textarea v-model="result.comment">{{result.comment}}</textarea>
        </dd>
      </dl>
    </form>
  </div>
</template>

<script>

const EMBLEM_TYPES = {
  killer: ['gatekeeper', 'devout', 'malicious', 'chaser'],
  survivor:['lightbringer', 'unbroken', 'benevolent', 'evader'],
};

const SURVIVOR_STATUS = ['生存', '脱出', '死亡', '切断'];

export default {
  name: 'log-edit',
  data() {
    return {
      isCreate: false,
      resultId: this.$store.getters['settings/getModeId'],
      result: {},
    };
  },
  computed: {
    isKiller() {
      if (!this.charactor) {
        return false;
      }
      return this.charactor.type === 'killer';
    },

    registDateTime() {
      console.log(this.$store.getters['results/createdDateTime'](this.resultId))
      return this.$store.getters['results/createdDateTime'](this.resultId);
    },

    updateDateTime() {
      return this.$store.getters['results/updateDateTime'](this.resultId);
    },

    playDateTime() {
      return this.$store.getters['results/playDateTime'](this.resultId);
    },

    charactor() {
      if (this.result.charactor_id == null) {
        return null;
      }
      return this.$store.getters['charactors/getCharactor'](this.result.charactor_id);
    },

    myParks() {
      return this.result.my_park_ids.map(id => this.$store.getters['parks/getPark'](id))
      //this.$store.getters['results/getMyParks'](this.result.id);
    },

    filterByEmblems() {
      if(!this.result.emblems) {
        return {};
      }

      const emblemsObj = this.result.emblems;
      let result = {};

      Object.keys(emblemsObj).forEach( (key) => {
        if (EMBLEM_TYPES[this.charactor.type].indexOf(key) === -1) {
          return;
        }
        result[key] = emblemsObj[key]
      });

      return result;

    },

    filterByParks() {
      if (this.isKiller === undefined) {
        return {};
      }

      const getterName = this.isKiller ? 'getFilterByKillerType' : 'getFilterBySurvivorType';
      return this.$store.getters[`parks/${getterName}`];;
    },

    title() {
      if (this.isCreate) {
        return '登録';
      } else {
        return `編集 <span>/ id: ${this.resultId}</span>`
      }
    },

    obtainPip() {
      return this.$store.getters['results/getObtainPip'](this.resultId);
    },

    inputCharactor: {
      get() {
        return this.result.charactor_id;
      },
      set (value) {
        this.updateForm({key: 'charactor_id', value: value });
      }
    },

    userRank() {
      return this.$store.getters['results/addedPipUserData'](this.obtainPip);
    }

  },
  methods: {
    onSubmit() {},
    updateForm(val) {
      const sendValue = {
        id: this.resultId,
        ...val,
      }
      this.$store.dispatch('results/update', sendValue);
    },

    changeEmblem(type) {
      const emblems = this.result.emblems;
      emblems[type] = emblems[type] >= 4 ? 0 : emblems[type] + 1;
      this.updateForm({key: 'emblems', value: emblems});
    },

    getPark(parkId) {
      console.log(parkId)
      return this.$store.getters['parks/getPark'](parkId)
    },

    changePark(e) {
      const result = {
        key: 'my_park_ids',
        value: this.$refs.park.map( ref => parseInt(ref.value)),
      }
      this.updateForm(result);
    },

    survivorStatusText(status) {
      return SURVIVOR_STATUS[status];
    },

    onClickSurvivorStatus(key) {
      const players_status = this.result.players_status;
      console.log(key, players_status)
      players_status[key] = parseInt(players_status[key]) >= 3 ? 0 : parseInt(players_status[key]) + 1;

      this.updateForm({key: 'players_status', value: players_status});

      if(!this.isKiller) {
        this.updateForm({key: 'status', value: players_status['player_1']});
      }
    },

    onClickFixedGenerator() {
      const fixed_generator = this.result.fixed_generator >= 5 ? 0 : this.result.fixed_generator + 1;
      this.updateForm({key: 'fixed_generator', value: fixed_generator});
    }
  },
  mounted() {
    if (this.resultId === undefined) {
      this.isCreate = true;
      this.$store.dispatch('results/create');
      this.resultId = this.$store.state.results.data.length - 1;
    }

    this.result = this.$store.getters['results/getResult'](this.resultId);

  },
  destroyed() {
    console.log('destroyed', this.userRank)
    if (this.isCreate) {
      this.updateForm({ key: 'played_user', value: this.userRank });
    }
  }
};
</script>

<style lang="scss">

</style>
