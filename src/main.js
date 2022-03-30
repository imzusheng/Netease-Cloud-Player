import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// fix NavigationDuplicated: Avoided redundant navigation to current location
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch((err) => err)
}

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
