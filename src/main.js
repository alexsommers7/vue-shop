import Vue from 'vue';
import App from './App';
import './utils/filters';
import { createPinia, PiniaVuePlugin } from 'pinia';

Vue.use(PiniaVuePlugin);
const pinia = createPinia();

new Vue({
  render: (h) => h(App),
  pinia,
}).$mount('#app');
