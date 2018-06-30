<template>
  <div class="editPage">
    <h2 v-html="title"></h2>
    <form v-if="resultId !== undefined" @submit="onSubmit">
      <p class="dateInfo">U:{{ updateDateTime }} / C:{{ registDateTime }}</p>
      <dl>
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
        <dt>スコア：エンブレム</dt>
        <dd>
          <ul class="emblemList" v-if="result.charactor_id !== null">
            <li v-for="(score, type) in filterByEmblems" :class="[type,`rank${score}`]">
              <div @click="changeEmblem(type)">
                <div class="imgWrap">
                  <img :src="getEmblemImagePath(type)" alt="">
                </div>
              </div>
            </li>
          </ul>
        </dd>
        <dt>スコア：得点</dt>
        <dd>
          <input type="number" v-model.number="result.score">
        </dd>
        <dt>全サバイバー状況</dt>
        <dd>
          <ul class="statusList">
            <li v-for="(status, key) in result.players_status">
              <div @click="onClickSurvivorStatus(key)">
                <span v-if="status == null">未登録</span>
                <div v-else>
                  <div class="statusListImgWrap">
                    <img :src="getStatusImagePath(status)">
                  </div>
                  {{survivorStatusText(status)}}
                </div>
              </div>
              <div class="playerNum" v-if="!isKiller && key === 'player_1'">
                YOUR
              </div>
              <div class="playerNum" v-else>{{key}}</div>
            </li>
          </ul>
        </dd>
        <div v-if="!isKiller">
          <dt>クリア状況</dt>
          <dd>{{ survivorStatusText(result.status) }}</dd>
        </div>
        <dt>修理された発電機</dt>
        <dd>
          <ul class="fixedGeneratorList">
            <li v-for="count in [1, 2, 3, 4, 5]" :key="count"  @click="onClickFixedGenerator(count)">
              <div :class="fixedGeneratorClass(count)">
                <img src="/images/generators.png">
              </div>
            </li>
          </ul>
          {{ result.fixed_generator }}台
        </dd>
        <dt>パーク</dt>
        <dd>
          <ul class="parkList">
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
        </dd>
        <!-- isKillerでの出し分けUIがめんどい -->
        <!-- <dt>参加プレイヤー情報</dt> -->
        <!-- <dd>{{ result.player_park }}</dd> -->
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
            <input type="number" v-model.number="inputUserRankRank">
            <input type="number" v-model.number="inputUserRankPip">
          </div>
        </dd>
        <dt>試合日</dt>
        <dd>{{ playDateTime }}</dd>
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
const SURVIVOR_STATUS_IMAGE = ['life', 'exit', 'death', 'disconnected'];

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
      const charactorType = this.isKiller ? 'killer' : 'survivor';
      return this.$store.getters['results/addedPipUserData']
        (this.obtainPip)[charactorType];
    },

    inputUserRankRank: {
      get() {
        if (!this.result || !this.result.played_user) {
          return
        }

        return this.isKiller ? this.result.played_user.killer.rank
          : this.result.played_user.survivor.rank;
      },
      set(value) {
        const result = {};
        result['key'] = 'played_user';
        const playedUserData = this.result.played_user;
        if (this.isKiller) {
          playedUserData['killer'].rank = value;
        } else {
          playedUserData['survivor'].rank = value;
        }

        result['value'] = playedUserData;
        this.updateForm(result);
      },
    },

    inputUserRankPip: {
      get() {
        if (!this.result || !this.result.played_user) {
          return
        }

        return this.isKiller ? this.result.played_user.killer.pip
          : this.result.played_user.survivor.pip;
      },
      set(value) {
        const result = {};
        result['key'] = 'played_user';

        const playedUserData = this.result.played_user;
        if (this.isKiller) {
          playedUserData['killer'].pip = value;
        } else {
          playedUserData['survivor'].pip = value;
        }

        result['value'] = playedUserData;
        this.updateForm(result);
      },
    },
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

    getEmblemImagePath(type) {
      return `../../images/${type}_em_ic.png`
    },

    getPark(parkId) {
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
      players_status[key] = parseInt(players_status[key]) >= 3 ? 0 : parseInt(players_status[key]) + 1;

      this.updateForm({key: 'players_status', value: players_status});

      if(!this.isKiller) {
        this.updateForm({key: 'status', value: players_status['player_1']});
      }
    },

    getStatusImagePath(status) {
      return `../../images/status_${SURVIVOR_STATUS_IMAGE[status]}.png`
    },

    onClickFixedGenerator(count) {
      const value = count === this.result.fixed_generator ? 0 : count;
      this.updateForm({key: 'fixed_generator', value: value});
    },

    fixedGeneratorClass(count) {
      return this.result.fixed_generator < count ? 'nonfix' : 'fixed';
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
    if (this.isCreate) {
      const value = this.result.last_played_user;
      if (this.isKiller) {
        value['killer'] = this.userRank;
      } else {
        value['survivor'] = this.userRank;
      }
      this.updateForm({ key: 'played_user', value: value });
    }
  }
};
</script>

<style lang="scss">
.editPage {
  color: #212121;

  h2 {
    margin: 0;
    padding: 4px 8px;
    font-size: 14px;
  }

  .dateInfo {
    padding-left: 8px;
    margin: 0;
    font-size: 10px;
    text-align: right;
  }

  dl {
    margin: 0;
  }

  dt {
    padding: 4px;
    font-size: 12px;
    background: lighten($mainColor, 10);
    color: $primaryColor;
  }

  dd {
    margin: 0;
    padding: 8px 4px 16px;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  select,
  input[type=number] {
    height: 42px;
  }

  select,
  input[type=number],
  textarea {
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;
  }

  textarea {
    height: auto;
    min-height: 160px;
  }

  .emblemList {
    width: 100%;
    display: flex;

    li {
      box-sizing: border-box;
      padding: 0 4px;
      width: 25%;
      flex: 1 1;

      img {
        max-width: 100%;
        max-height: 70px;
      }

      .imgWrap {
        border-radius: 3px;
        box-shadow: 0 0 3px 0 #666;
        line-height: 0;
        text-align: center;
      }

      &.rank0 {
        .imgWrap {
          background: transparent;
        }
      }

      &.rank1 {
        .imgWrap {
          background: $bronze;
        }
      }

      &.rank2 {
        .imgWrap {
          background: $silver;
        }
      }

      &.rank3 {
        .imgWrap {
          background: $gold;
        }
      }

      &.rank4 {
        .imgWrap {
          background: $iridescent;
        }
      }
    }
  }

  .parkList {
    li {
      margin: 4px 0;
    }
  }

  .statusList {
    width: 100%;
    display: flex;

    li {
      box-sizing: border-box;
      padding: 0 4px;
      width: 25%;
      flex: 1 1;
      text-align: center;

      .statusListImgWrap {
        position: relative;
        height: 70px;
        line-height: 0;
        vertical-align: middle;
      }

      img {
        height: 70px;
      }
    }

    .playerNum {
      font-size: 12px;
    }
  }

  .fixedGeneratorList {
    width: 100%;
    display: flex;

    li {
      box-sizing: border-box;
      padding: 0 4px;
      width: 20%;
      flex: 1 1;
      text-align: center;

      img {
        max-width: 100%;
        max-height: 70px;
      }

      .fixed {
        background: rgba($iridescent, 0.5);
        line-height: 0;
        border-radius: 3px;
      }

      .nonfix {
        background: rgba($none, 0.5);
        line-height: 0;
        border-radius: 3px;
      }
    }
  }
}
</style>
