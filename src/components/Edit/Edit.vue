<template>
  <div>
    <p>edit</p>
    <h2 v-html="title"></h2>
    <form @submit="onSubmit">
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
          <p>{{ charactor.name_en }}/{{ charactor.name_jp }}</p>
        </dd>
        <dt>スコア：得点</dt>
        <dd>{{ result.score }}</dd>
        <dt>スコア：エンブレム</dt>
        <dd>
          <ul>
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
            <li v-for="park in myParks">
              <div v-if="park !== undefined">
                {{park.name_en}}
                /
                {{park.name_jp}}
              </div>
              <div v-else> 不正確な情報が登録されています。 </div>
            </li>
          </ul>
          {{ result.my_park }}
        </dd>
        <!-- isKillerでの出し分けUIがめんどい -->
        <!-- <dt>参加プレイヤー情報</dt> -->
        <!-- <dd>{{ result.player_park }}</dd> -->
        <dt>全サバイバー状況</dt>
        <dd>
          <ul>
            <li v-for="(status, key) in result.players_status">
              <div>
                <span v-if="status == 0">生存</span>
                <span v-if="status == 1">死亡</span>
                <span v-if="status == 2">脱出</span>
                <span v-if="status == 3">切断</span>
                <span v-if="status == null">未登録</span>
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
        <dd>{{ result.fixed_generators }}台</dd>
        <dt>ランク</dt>
        <dd>
          <p>取得Pip：{{obtainPip}}</p>
          <div v-if="isCreate">
            aaa
          </div>
          <div v-else>
            {{ result.played_user }}
          </div>
        </dd>
        <dt>コメント</dt>
        <dd>{{ result.comment }}</dd>
      </dl>
    </form>
  </div>
</template>

<script>

const EMBLEM_TYPES = {
  killer: ['gatekeeper', 'devout', 'malicious', 'chaser'],
  survivor:['lightbringer', 'unbroken', 'benevolent', 'evader']
};

export default {
  name: 'log-edit',
  computed: {
    isKiller() {
      return this.charactor.type === 'killer';
    },

    isCreate() {
      return this.resultId == undefined;
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

    resultId() {
      return this.$store.getters['settings/getModeId'];
    },

    result() {
      return this.$store.getters['results/getResult'](this.resultId);
    },

    charactor() {
      return this.$store.getters['charactors/getCharactor'](this.result.charactor_id);
    },

    myParks() {
      return this.$store.getters['results/getMyParks'](this.resultId);
    },

    filterByEmblems() {
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
      return this.$store.getters['parks/getPark'](parkId)
    }
  },
  mounted() {
    console.log(
      this.resultId,
      this.$store.getters['results/getResult'](this.resultId)
    )
    console.log(this.result)

    if (this.resultId === undefined) {
      this.isCreate = true;
      this.$store.getters['results/create'](this.resultId);

    }

  },
};
</script>

<style lang="scss">

</style>
