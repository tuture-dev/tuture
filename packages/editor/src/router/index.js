import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../views/Home.vue';
import Toc from '../views/Toc.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/toc',
    name: 'Toc',
    component: Toc,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
