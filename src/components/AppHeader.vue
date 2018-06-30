<template>
  <div class="headerWrap">
    <h1>
      dead by daylight Log
      <span class="nowMode">{{type}}</span>
    </h1>
    <div class="switch">
      <ul>
        <li>
          <button @click="changeType('list')" ref="list">Result</button>
        </li>
        <li v-show="type.indexOf('edit') === -1">
          <button @click="changeType('edit')" ref="edit">Regist</button>
        </li>
        <li>
          <button @click="changeType('setting')" ref="setting">Setting</button>
        </li>
      </ul>
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
  background: #000;
  border-top: 1px solid #666;
  position: fixed;
  z-index: 10;
  width: 100%;
  top: 0;

  h1 {
    font-family: Anton, sans-serif;
    text-transform: uppercase;
    margin: 0;
    font-size: 14px;
    color: #fff;
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
      height: 36px;
      border-bottom: 1px solid $mainColor;

      button {
        width: 100%;
        height: 100%;
        font-size: 14px;
        background: $primaryColor;
        background-image: none;
        border: none;
      }
    }
  }

  .nowMode {
    text-align: right;
    font-size: 12px;
    padding: 0 4px;
    margin: 0;

    &::before {
      content: '-';
      margin: 0 8px;
    }
  }
}
</style>
