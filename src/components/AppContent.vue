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
    renderList() {

      return this.$store.state.settings.mode == 'list';
    },
    renderEdit() {
      return this.$store.state.settings.mode == 'edit';
    },
    renderSetting() {
      return this.$store.state.settings.mode == 'setting';
    },
  },
  mounted() {
    console.log('appContent', this.$store.state.settings.mode);
  },
};
</script>

<style lang="scss">

</style>
