import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'home',
  // webpackChunkName: "home"
  component: () => import('../views/HomeView.vue')
}, {
  path: '/discovery',
  name: 'discovery',
  component: () => import('../views/HomeDiscovery.vue')
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
