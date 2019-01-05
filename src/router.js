import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Export from './views/Export.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/export',
      name: 'export',
      component: Export,
    },
  ],
});
