import Vue from 'vue';
import App from '~/components/App.vue';
import store from '~/store';

console.log(store);
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
