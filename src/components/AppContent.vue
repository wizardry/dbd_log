<template>
  <div>
    <div v-if="renderList">
      <log-list/>
    </div>
    <div v-if="renderEdit">
      <log-edit/>
    </div>
    <div v-if="renderSetting">
      <settings/>
    </div>
  </div>
</template>

<script>

import LogList from './List/LogList.vue';
import LogEdit from './Edit/Edit.vue';
import Settings from './Setting/Setting.vue';

export default {
  name: 'app-content',
  components: {
    LogList,
    LogEdit,
    Settings,
  },
  computed: {
    mode() {
      return this.$store.state.settings.mode.split('/')[0]
    },
    renderList() {
      return this.mode === 'list';
    },
    renderEdit() {
      return this.mode === 'edit';
    },
    renderSetting() {
      return this.mode === 'setting';
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss">

</style>
