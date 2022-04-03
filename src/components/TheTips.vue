<!--
  全局提示小组件
-->
<template>
  <transition name="fade">
    <div class="tips" v-if="isShow">
      {{ $store.state.tips }}
    </div>
  </transition>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'TheTips',

  data () {
    return {
      isShow: false,
      timer: undefined
    }
  },

  methods: {
    ...mapMutations(['setTips'])
  },

  watch: {
    '$store.state.tips': {
      handler (newVal) {
        console.log(this.timer)
        this.setTips(newVal)
        this.isShow = true
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = undefined
        }

        this.timer = setTimeout(() => {
          this.isShow = false
        }, 2000)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tips {
  position: fixed;
  bottom: 84px;
  left: 50%;
  z-index: 999;
  padding: 10px 16px;
  transform: translate(-50%, 0);
  background: rgba(40, 40, 40, 1);
  color: #fff;
  border-radius: 4px;
  letter-spacing: 1px;
  box-shadow: 4px 4px 20px rgb(8, 8, 8);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
