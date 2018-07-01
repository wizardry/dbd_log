<template>
  <div class="settingsPage">
    <h2>設定</h2>
    <div>
      <dl>
        <dt>データリセット</dt>
        <dd>
          <p>開発中画面、後方互換がないバージョンを表示した、などデータに不整合が生じた場合に、localStorageにあるresultsを初期化します</p>
          <button @click="resetHandler()">データをリセットする</button>
        </dd>
        <dt>インポート</dt>
        <dd>
          <p>データの書き換えを行います。不整合のあるデータを入力するとそのまま取り込み動かなくなる可能性があります。</p>
          <button @click="importHandler()">リザルト情報を入力する</button>
          <textarea v-model="importData"></textarea>
        </dd>
        <dt>エクスポート</dt>
        <dd>
          <p>現在保存されているリザルトデータをJSON形式で出力します。</p>
          <button @click="exportHandler()">リザルト情報を出力する</button>
          <textarea v-model="exportData"></textarea>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
export default {
  name: 'settings',
  data() {
    return {
      importData: '',
      exportData: '',
    }
  },
  cumputed: {},
  methods: {
    resetHandler() {
      if (window.confirm('登録されている全リザルト情報を削除します。')) {
        localStorage.removeItem('results');
        this.$store.dispatch('results/initialize');
      }
    },
    importHandler() {
      console.log('hoge')
      if (window.confirm('直下テキストエリアに入力されているデータに書き換えます')) {
        localStorage.removeItem('resutls');
        localStorage.setItem('results', JSON.stringify(this.importData));
        this.$store.dispatch('results/initialize');
      }
    },
    exportHandler() {
      this.exportData = localStorage.getItem('results');
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss">
.settingsPage {
  color: #212121;

  h2 {
    margin: 0;
    padding: 4px 8px;
    font-size: 14px;
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

  textarea {
    width: 100%;
    height: auto;
    min-height: 160px;
    box-sizing: border-box;
    font-size: 14px;
  }

  button {
    display: block;
    box-sizing: border-box;
    margin-bottom: 16px;
    padding: 8px 4px;
    border: 1px solid $mainColor;
    border-radius: 3px;
    cursor: pointer;
    background: #f1f1f1;
    width: 100%;
  }
}
</style>
