import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

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
      component: () => import('@/views/DetailPlayList.vue')
    }, {
      path: 'artist',
      name: 'artist',
      component: () => import('@/views/DetailArtist.vue')
    }, {
      path: 'more',
      name: 'more',
      component: () => import('@/views/DetailDisplayMore.vue')
    }]
  },
  {

    path: '/',
    component: () => import('@/views/LayoutHeadless.vue'),
    children: [
      {
        path: 'playqueue',
        name: 'playqueue',
        component: () => import('@/views/DetailPlayQueue.vue')
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

router.afterEach((to, from) => {
  store.commit('setPlayQueueStatus', to.name === 'playqueue')
  if (store.state.error.status) {
    store.commit('setError', {
      status: false
    })
  }
})

export default router
