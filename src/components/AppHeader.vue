<template>
  <div class="headerWrap">
    <h1>dead by daylight Log</h1>
    <div class="switch">
      <ul>
        <li>
          <button @click="changeType('list')" ref="list">LIST MODE</button>
        </li>
        <li>
          <button @click="changeType('edit')" ref="edit">EDIT MODE</button>
        </li>
        <li>
          <button @click="changeType('setting')" ref="setting">SETTING MODE</button>
        </li>
      </ul>
      <p class="nowMode">{{type}}</p>
    </div>
  </div>

</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'app-header',
  data() {
    return {};
  },
  computed: {
    type() {
      if(!this.$store.state.settings.mode) {
        return 'list';
      }

      return this.$store.state.settings.mode
    },
  },
  methods: {
    changeType(type) {
      this.$store.dispatch('settings/changeMode', type);
    }
  }
};

</script>
<style lang="scss">
.headerWrap {
  background: #616161;
  border-top: 1px solid #666;

  h1 {
    margin: 0;
    font-size: 14px;
    color: #999;
    padding: 4px 8px;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;

    li {
      flex: 1 1;
      justify-content: space-around;
      text-align: center;

      button {
        width: 95%;
      }
    }
  }

  .nowMode {
    text-align: right;
    color: #fff;
    font-size: 12px;
    padding: 0 4px;
    margin: 0;
  }
}
</style>
