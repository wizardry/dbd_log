<template>
  <div class="logList">
    <div v-if="results.length > 0">
      <ul>
        <log-list-item v-for="(result, index) in reverseResults" :result="result" :key="result.id" />
      </ul>
    </div>
    <div v-else>
      <p class="firstMessage">info: ナビゲーションのRegistから戦績を登録しましょう。</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LogListItem from '~/components/List/LogListItem.vue'

export default {
  name: 'log-list',
  components: {
    LogListItem
  },
  computed: {
    reverseResults() {
      return this.results.reverse();
    },
    ...mapState({
      results: state => state.results.data,
      charactors: state => state.charactors.data,
      parks: state => state.parks.data,
    }),
  },
  mounted() {
  },
};
</script>

<style lang="scss">
.firstMessage {
  padding: 8px;
}

.logList {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
}
</style>
