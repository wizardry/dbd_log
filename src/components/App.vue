<template>
  <div>
    <app-header/>
    <app-content/>
    <app-footer/>
  </div>
</template>

<script>
import AppHeader from './AppHeader.vue'
import AppContent from './AppContent.vue'
import AppFooter from './AppFooter.vue'

export default {
  components: {
    AppHeader,
    AppContent,
    AppFooter,
  },
  data() {
    return {
    };
  },
  mounted() {
    this.$store.dispatch('settings/initialize');
    this.$store.dispatch('parks/initialize');
    this.$store.dispatch('charactors/initialize');
    this.$store.dispatch('results/initialize');
  }
};
</script>

<style lang="scss">

.appWrap {
  background-color: #fff;
}
</style>
