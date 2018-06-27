<template>
  <li>
    <button @click="onClickDelete()">
      削除
    </button>
    <button @click="onClickToEditMode()">
      詳細をみる
    </button>
    <div>
      type: {{ charactor.type }}
    </div>
    <div v-if="isKiller" key="killerScore">
      <ul>
        <li class="gatekeeper">{{ result.emblems.gatekeeper }}</li>
        <li class="devout">{{ result.emblems.devout }}</li>
        <li class="malicious">{{ result.emblems.malicious }}</li>
        <li class="chaser">{{ result.emblems.chaser }}</li>
      </ul>
    </div>
    <div v-else key="survivorScore">
      <ul>
        <li class="lightbringer">{{ result.emblems.lightbringer }}</li>
        <li class="unbroken">{{ result.emblems.unbroken }}</li>
        <li class="benevolent">{{ result.emblems.benevolent }}</li>
        <li class="evader">{{ result.emblems.evader }}</li>
      </ul>
    </div>
    <div>{{ pipCount }}</div>
  </li>
</template>

<script>
export default {
  props: {
    result: {},
  },
  name: 'log-list-item',
  methods: {
    onClickToEditMode() {
      this.$store.dispatch('settings/changeMode', `edit/${this.result.id}`);
    },

    onClickDelete() {
      this.$store.dispatch('settings/delete', this.result.id);
    }

  },
  computed: {
    pipCount() {
      return this.$store.getters['results/getObtainPip'](this.result.id);
    },
    charactor() {
      return this.$store.getters['charactors/getCharactor'](this.result.charactor_id);
    },
    isKiller() {
      return this.charactor.type === 'killer';
    },
    isSurvivor() {
      return this.charactor.type === 'survivor';
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss">

</style>
