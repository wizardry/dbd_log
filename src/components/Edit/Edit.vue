<template>
  <div>
    <p>edit</p>
    <h2 v-html="title"></h2>
    <form @submit="onSubmit">
      <dl>
        <dt>id</dt>
        <dd>{{ $data._result.id }}</dd>
        <dt>登録日</dt>
        <dd>{{ registDateTime }}</dd>
        <dt>更新日</dt>
        <dd>{{ updateDateTime }}</dd>
        <dt>試合日</dt>
        <dd>{{ playDateTime }}</dd>
        <dt>使用キャラクター</dt>
        <dd>{{ charactor.name_en }}/{{ charactor.name_jp }}</dd>
        <dt>スコア：得点</dt>
        <dd>{{ $data._result.score }}</dd>
        <dt>スコア：エンブレム</dt>
        <dd>{{ $data._result.emblems }}</dd>
        <dt>パーク</dt>
        <dd>{{ $data._result.my_park }}</dd>
        <dt>参加プレイヤー情報</dt>
        <dd>{{ $data._result.player_park }}</dd>
        <dt>全サバイバー状況</dt>
        <dd>{{ $data._result.players_status }}</dd>
        <dt>クリア状況</dt>
        <dd>{{ $data._result.status }}</dd>
        <dt>修理された発電機</dt>
        <dd>{{ $data._result.fixed_generators }}</dd>
        <dt>ランク</dt>
        <dd>{{ $data._result.played_user }}</dd>
        <dt>コメント</dt>
        <dd>{{ $data._result.comment }}</dd>
      </dl>

    </form>
  </div>
</template>

<script>

const resultParams = {
  id: null,
  created: new Date(),
  update: null,
  date: null,
  charactor_id: 1,
  score: null,
  emblems: {
    gatekeeper: null,
    devout: null,
    malicious: null,
    chaser: null,
    lightbringer: null,
    unbroken: null,
    benevolent: null,
    evader: null,
  },
  my_park: [null, null, null, null],
  player_park: {
    killer: [null, null, null, null],
    survivors: {
      player_1: [null, null, null, null],
      player_2: [null, null, null, null],
      player_3: [null, null, null, null],
      player_4: [null, null, null, null],
    }
  },
  players_status: {
    player_1: 0,
    player_2: 0,
    player_3: 0,
    player_4: 0,
  },
  status: 'escape',
  fixed_generators: 0,
  played_user: {
    rank: null,
    pip: null,
  },
  comment: '',
};

export default {
  name: 'log-edit',
  data() {
    return {
      _result: this.resultId ? JSON.parse(JSON.stringify(this.masterResult)) : resultParams,
    }
  },
  computed: {
    registDateTime() {
      return this.dateFormat(this.$data._result.created);
    },

    updateDateTime() {
      return this.dateFormat(this.$data._result.update);
    },

    playDateTime() {
      return this.dateFormat(this.$data._result.date);
    },

    resultId() {
      return this.$store.getters['settings/getModeId'];
    },

    masterResult() {
      return this.$store.getters['results/getResult'](this.resultId);
    },

    charactor() {

      console.log(
        this.$store.getters['charactors/getCharactor'](this.$data._result.charactor_id)
      )
      return this.$store.getters['charactors/getCharactor'](this.$data._result.charactor_id);
    },

    title() {
      if (this.resultId == undefined) {
        return '登録';
      } else {
        return `編集 <span>/ id: ${this.resultId}</span>`
      }
    },
  },
  methods: {
    onSubmit() {},
    dateFormat(date) {
      let _date = null;
      if (date === undefined || date === null) {
        _date = new Date();
      } else {
        _date = new Date(date);
      }
      console.log(_date)
      return _date.toLocaleString();
    }
  },
  mounted() {
    console.log(
      this.resultId,
      this.$store.getters['results/getResult'](this.resultId)
    )
    console.log(this.$data._result)

  },
};
</script>

<style lang="scss">

</style>
