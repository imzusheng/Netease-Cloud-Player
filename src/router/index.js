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
      path: 'album',
      name: 'album',
      component: () => import('@/views/DetailPlayList.vue')
    }, {
      path: 'artist',
      name: 'artist',
      component: () => import('@/views/DetailArtist.vue')
    }, {
      path: 'more',
      name: 'more',
      component: () => import('@/views/DetailDisplayMore.vue')
    }, {
      path: 'search',
      name: 'search',
      component: () => import('@/views/DetailSearch.vue')
    }, {
      path: 'library',
      name: 'library',
      component: () => import('@/views/HomeLibrary.vue')
    }, {
      path: 'video',
      name: 'video',
      component: () => import('@/views/DetailVideo.vue')
    }, {
      path: 'mv',
      name: 'mv',
      component: () => import('@/views/DetailVideo.vue')
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
  mode: process.env.NODE_ENV === 'development' ? 'history' : 'hash',
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
  // 发生错误，显示错误页面
  if (store.state.error.status) {
    store.commit('setError', {
      status: false
    })
  } else {
    store.commit('setPlayQueueStatus', to.name === 'playqueue')
    store.commit('setCurRouter', to.name)
  }
})

export default router
