import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../views/Home.vue';
import Toc from '../views/Toc.vue';
import Article from '../views/Article.vue';

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
  {
    path: '/articles/:id',
    name: 'Article',
    component: Article,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
