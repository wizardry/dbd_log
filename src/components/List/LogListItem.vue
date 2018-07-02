<template>
  <li class="resultItem">
    <button class="toDetailButton" @click="onClickToEditMode()">
      >
    </button>
    <div class="headerRow">
      <button class="deleteButton" @click="onClickDelete()">
        del
      </button>
      <span class="userType">type: {{ charactor.type }}/ id: {{result.id}}</span>
    </div>
    <div class="scoreRow">
      <ul class="emblemList">
        <li v-for="(score, type) in filterByEmblems" :class="[type,`rank${score}`]">
          <div class="imgWrap">
            <img :src="getEmblemImagePath(type)" alt="">
          </div>
        </li>
      </ul>
      <div class="obtianPip">{{ pipCount }}</div>
    </div>
  </li>
</template>

<script>
const EMBLEM_TYPES = {
  killer: ['gatekeeper', 'devout', 'malicious', 'chaser'],
  survivor:['lightbringer', 'unbroken', 'benevolent', 'evader'],
};

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
      if (window.confirm(`ID: ${this.result.id} のリザルトを削除します`)) {
        this.$store.dispatch('results/delete', this.result.id);
      }
    },

    getEmblemImagePath(type) {
      return `/dbd_log/images/${type}_em_ic.png`
    },
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
    filterByEmblems() {
      const emblemsObj = this.result.emblems;
      let result = {};

      Object.keys(emblemsObj).forEach( (key) => {
        if (EMBLEM_TYPES[this.charactor.type].indexOf(key) === -1) {
          return;
        }
        result[key] = emblemsObj[key]
      });

      return result;
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss">
.resultItem {
  position: relative;
  padding: 4px 32px 4px 8px;
  margin: 0;
  list-style: none;
  border-top: 1px solid #ccc;

  &:last-child {
    border-bottom: 1px solid #ccc;
  }

  ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .scoreRow {
    display: flex;
  }

  .headerRow {
    position: relative;
    margin-bottom: 8px;
    font-size: 12px;
  }

  .emblemList {
    margin: 0 -4px;
    width: 80%;
    display: flex;

    li {
      box-sizing: border-box;
      padding: 0 4px;
      width: 25%;
      flex: 1 1;

      img {
        max-width: 100%;
      }

      .imgWrap {
        border-radius: 3px;
        box-shadow: 0 0 3px 0 #666;
        line-height: 0;
      }

      &.rank0 {
        .imgWrap {
          background: transparent;
        }
      }

      &.rank1 {
        .imgWrap {
          background: $bronze;
        }
      }

      &.rank2 {
        .imgWrap {
          background: $silver;
        }
      }

      &.rank3 {
        .imgWrap {
          background: $gold;
        }
      }

      &.rank4 {
        .imgWrap {
          background: $iridescent;
        }
      }
    }
  }

  .obtianPip {
    width: 20%;
    text-align: right;
    font-size: 32px;
    color: #696969;
    font-weight: bold;
  }

  .toDetailButton {
    width: 20px;
    height: 100%;
    position: absolute;
    border: none;
    right: 0;
    top: 0;
    background: $mainColor;
    color: $primaryColor;
    cursor: pointer;
  }

  .deleteButton {
    position: absolute;
    top: 0;
    left: 0;
    width: 50px;
    border: 1px solid #ccc;
  }

  .userType {
    display: block;
    text-align: right;
  }
}
</style>
