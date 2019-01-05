import Vue from 'vue';
import EvaIcons from 'vue-eva-icons';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(EvaIcons);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
