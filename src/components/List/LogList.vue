<template>
  <div>
    <ul>
      <log-list-item v-for="(result, index) in results" :result="result" :key="result.id" />
    </ul>
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
    ...mapState({
      results: state => state.results.data,
      charactors: state => state.charactors.data,
      parks: state => state.parks.data,
    }),
  },
  mounted() {
    console.log('appContent');
    console.log(this, this)
  },
};
</script>

<style lang="scss">

</style>
