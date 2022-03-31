import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // webpackChunkName: "home"
    component: () => import('@/views/LayoutDefault.vue'),
    children: [{
      path: '',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    }, {
      path: 'discovery',
      name: 'discovery',
      component: () => import('@/views/HomeDiscovery.vue')
    }, {
      path: 'playlist',
      name: 'playlist',
      component: () => import('@/views/PlaylistView.vue')
    }]
  }]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior (to, from, savedPosition) {
    return {
      x: 0,
      y: 0
    }
  }
})

export default router
