<!--
  无头部布局页面
-->

<template>
  <div
    id="layout-headless"
    :style="{ '--color-playlist': $store.state.curPlaylistColor }"
  >
    <!-- 加载logo -->
    <TheLoading v-if="$store.state.loading" />

    <TheTips />

    <router-view v-show="!$store.state.loading"></router-view>
  </div>
</template>

<script>
import TheLoading from '@/components/TheLoading'
import TheTips from '@/components/TheTips'
import { pickUpName } from '@/util'
import moment from 'moment'

export default {
  name: 'LayoutDefault',

  components: {
    TheLoading,
    TheTips
  },

  created () {
    this.$store.commit('reset')
  },

  computed: {
    // 提取歌手名字(拼接数组)
    getPickupName () {
      return function (artists, Separator = '/') {
        if (!artists) return ''
        return pickUpName(artists, Separator)
      }
    },
    // player获取时间
    getPubTime () {
      return function (timeStamp) {
        if (!timeStamp) return ''
        return moment(timeStamp).format('YYYY')
      }
    }
  }
}
</script>

<style lang="less">
#layout-headless {
  --color-playlist: "0, 0, 0, 1";
  width: 100%;
  position: relative;
  background-color: rgba(var(--color-playlist));
  transition: background-color 0.65s;
}
</style>
