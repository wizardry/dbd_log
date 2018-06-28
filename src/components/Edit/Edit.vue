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
        <dd>{{ charactor.name_en }}/{{ charactor.name_jp }}</dd>
        <dt>スコア：得点</dt>
        <dd>{{ result.score }}</dd>
        <dt>スコア：エンブレム</dt>
        <dd>
          <ul>
            <li v-for="(score, type) in filterByEmblems" :class="type">
              score {{ score }}
              <br>
              type {{ type }}
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
            <li v-for="(status, index) in result.players_status">
              <div>
                <span v-if="status == 0">生存</span>
                <span v-if="status == 1">死亡</span>
                <span v-if="status == 2">脱出</span>
                <span v-if="status == 3">切断</span>
                <span v-if="status == null">未登録</span>
              </div>
              <div v-if="!isKiller && index === 0">
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
        if (emblemsObj[key] === null) {
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
    }
  },
  methods: {
    onSubmit() {},
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
